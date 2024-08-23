import type { DocumentNotification } from 'kuzzle-sdk';
import { getKuzzle } from '@shared/get-kuzzle';
import { dbClassVersion } from '@shared/get-dbclass-version';
import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../types';
import type { ResultScheme } from '../node/store';
import handleDataChanges from './handleDataChanges';
import createFrontItem from './createFrontItem';

// Базируется на hash каждой схемы класса.
// Если хеш есть в подписках и есть в данных, значит схема не изменилась - пропускаем.
// Если хеш есть в подписках, но нет в данных, значит старая схема изменилась - отписываемся.
// Если хеша нет в подписках, но есть в данных, значит это новая схема - подписываемся.
export const handleSubscribe = (p: Props) => {
	const { schemes, subscribes } = p.store;
	// Подписка на новые схемы.
	schemes.forEach((d, schemeHash) => {
		if (!subscribes.has(schemeHash)) subscribeToScheme(p, d.scheme, schemeHash);
	});

	// Отписка от больше не существующих схем.
	subscribes.forEach((_, schemeHash) => {
		if (!schemes.has(schemeHash)) unSubscribeFromScheme(p, schemeHash);
	});
};

export const subscribe = (p: Props) => p.store.schemes.forEach((d, schemeHash) => subscribeToScheme(p, d.scheme, schemeHash));

export const unSubscribe = (p: Props) => p.store.subscribes.forEach((_, schemeHash) => unSubscribeFromScheme(p, schemeHash));

export const subscribeToScheme = async (p: Props, scheme: ResultScheme, schemeHash: string) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;

	const dbClassV = dbClassVersion(scheme.dbClass);

	if (dbClassV)
		K.realtime
			.subscribe(dbName, dbClassV, scheme.filters || {}, (notif) => {
				if (notif.type !== 'document') return;
				handleNotification(p, schemeHash, notif as any);

				log.info(`Subscribe - ${notif.action} ${scheme.dbClass}: `, notif.result);
			})
			.then((roomId) => {
				p.store.subscribes.set(schemeHash, roomId);

				log.info(`Subscribed to "${scheme.dbClass}" with schemeHash "${schemeHash}"`);
			})
			.catch((error) => log.error(`Subscribe error`, error));
};

export const unSubscribeFromScheme = async (p: Props, schemeHash: string) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;

	const roomId = p.store.subscribes.get(schemeHash);

	if (roomId)
		K.realtime
			.unsubscribe(roomId)
			.then(() => {
				p.store.subscribes.delete(schemeHash);

				log.info(`Unsubscribed from schemeHash "${schemeHash}"`);
			})
			.catch((error) => log.error(`Unsubscribe error`, error));
};

// Поскольку подписки идут по всем схемам, можно обрабатывать item найденный в этой схеме. Дубли отработает тригер другой схемы.
const handleNotification = (
	p: Props,
	schemeHash: string,
	notif: DocumentNotification & { result: { _updatedFields: string[] } }
) => {
	const sort = R.libs.sort;
	const { get, set } = R.libs.just;

	const schemeData = p.store.schemes.get(schemeHash);
	if (schemeData) {
		const frontItem = schemeData.items.get(notif.result._id);

		if (notif.scope === 'in') {
			// Обновление существующего item.
			if (frontItem) {
				notif.result._updatedFields.map((field) => set(frontItem, field, get(notif.result._source, field)));
				const sorts = schemeData.scheme.sorts;
				if (sorts) {
					let items = Array.from(schemeData.items.values());
					items = sort(items).by(sorts.map((s) => ({ [Object.values(s)[0]]: (i: any) => get(i, Object.keys(s)[0]) } as any)));
					items.map((i) => schemeData.items.set(i.kid, i));
				}
			} else {
				// Добавление нового item.
				const newRawItem: Item = {
					...notif.result._source,
					dbClass: schemeData.scheme.dbClass,
					id: notif.result._id,
				};

				p.store.items.set(newRawItem.id, newRawItem);
				const sorts = schemeData.scheme.sorts;

				const newBackendItem = p.store.items.get(newRawItem.id);
				if (newBackendItem) {
					createFrontItem(schemeData.items, newBackendItem);
					schemeData.itemIds.push(newBackendItem.id);
					// Нужно сменить сортировку в itemIds. schemeData.items - сортировка не важна.
					if (sorts) {
						let items = Array.from(schemeData.items.values());
						items = sort(items).by(sorts.map((s) => ({ [Object.values(s)[0]]: (i: any) => get(i, Object.keys(s)[0]) } as any)));
						schemeData.itemIds = items.map((i) => i.kid);
					}
					schemeData.fetched++;
					schemeData.total++;
				}
			}
		}

		// Удаление существующего item.
		if (notif.scope === 'out' && frontItem) {
			// Нельзя удалять, если есть frontItem в другой схеме, ссылающийся на item.
			if (Array.from(p.store.schemes.values()).filter((i) => i.itemIds.includes(frontItem.kid)).length === 1)
				p.store.items.delete(frontItem.kid);
			schemeData.items.delete(frontItem.kid);
			schemeData.fetched--;
			schemeData.total--;
		}
	}

	// Обработаем изменения и отправим их.
	handleDataChanges(p);
};

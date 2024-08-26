import type { DocumentNotification } from 'kuzzle-sdk';
import { getKuzzle } from '@shared/get-kuzzle';
import { dbClassVersion } from '@shared/get-dbclass-version';
import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../types';
import type { ResultScheme } from '../node/store';

// Базируется на hash каждой схемы класса.
// Если хеш есть в подписках и есть в данных, значит схема не изменилась - пропускаем.
// Если хеш есть в подписках, но нет в данных, значит старая схема изменилась - отписываемся.
// Если хеша нет в подписках, но есть в данных, значит это новая схема - подписываемся.
export const handleSubscribe = (p: Props) => {
	const schemes = p.store.data.schemes;
	const subscribes = p.store.subscribes;
	// Подписка на новые схемы.
	schemes.forEach((d, schemeHash) => {
		if (!subscribes.has(schemeHash)) subscribeToScheme(p, d.scheme, schemeHash);
	});

	// Отписка от больше не существующих схем.
	subscribes.forEach((_, schemeHash) => {
		if (!schemes.has(schemeHash)) unSubscribeFromScheme(p, schemeHash);
	});
};

export const subscribe = (p: Props) =>
	p.store.data.schemes.forEach((d, schemeHash) => subscribeToScheme(p, d.scheme, schemeHash));

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

	const schemeData = p.store.data.schemes.get(schemeHash);
	if (schemeData) {
		const item = R.items.get(notif.result._id);

		if (notif.scope === 'in') {
			// Обновление существующего item.
			if (item) {
				notif.result._updatedFields.map((field) => set(item, field, get(notif.result._source, field)));

				const sorts = schemeData.scheme.sorts;
				if (sorts) {
					let items = schemeData.itemIds.map((id) => R.items.get(id)).filter((i) => i !== undefined);
					items = sort(items).by(sorts.map((s) => ({ [Object.values(s)[0]]: (i: any) => get(i, Object.keys(s)[0]) } as any)));
					schemeData.itemIds = items.map((i) => i.id);
				}
			} else {
				// Добавление нового item.
				const newRawItem = {
					...notif.result._source,
					dbClass: schemeData.scheme.dbClass,
					id: notif.result._id,
				} as Item;
				R.items.set(newRawItem.id, newRawItem);
				R.subscribes.set(newRawItem.id, []);
				schemeData.itemIds.push(newRawItem.id);

				const newItem = R.items.get(newRawItem.id);
				if (newItem) {
					// Нужно сменить сортировку в itemIds.
					const sorts = schemeData.scheme.sorts;
					if (sorts) {
						let items = schemeData.itemIds.map((id) => R.items.get(id)).filter((i) => i !== undefined);
						items = sort(items).by(sorts.map((s) => ({ [Object.values(s)[0]]: (i: any) => get(i, Object.keys(s)[0]) } as any)));
						schemeData.itemIds = items.map((i) => i.id);
					}
					schemeData.fetched++;
					schemeData.total++;
				}
			}
		}

		// Удаление существующего item.
		if (notif.scope === 'out' && item) {
			schemeData.itemIds = schemeData.itemIds.filter((id) => id !== item.id);
			schemeData.fetched--;
			schemeData.total--;
		}
	}
};

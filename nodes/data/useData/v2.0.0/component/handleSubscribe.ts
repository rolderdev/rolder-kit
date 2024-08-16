import set from 'just-safe-set';
import get from 'just-safe-get';
import { sort } from 'fast-sort';
import { DocumentNotification } from 'kuzzle-sdk';
import { getKuzzle } from '@shared/get-kuzzle';
import { dbClassVersion } from '@shared/get-dbclass-version';
import { Item } from '@shared/types-v0.1.0';
import type { Props, ResultScheme } from '../types';
import handleDataChanges from './handleDataChanges';

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

const handleNotification = (
	p: Props,
	schemeHash: string,
	notif: DocumentNotification & { result: { _updatedFields: string[] } }
) => {
	const schemeData = p.store.schemes.get(schemeHash);
	if (schemeData) {
		if (notif.scope === 'in') {
			const item = p.store.items.get(notif.result._id);
			// Обновление существующего item.
			if (item) {
				notif.result._updatedFields.map((i) => set(item, i, get(notif.result._source, i)));
				const sorts = schemeData.scheme.sorts;
				if (sorts) {
					schemeData.items = sort(schemeData.items).by(
						sorts.map((s) => ({ [Object.values(s)[0]]: (i) => get(i, Object.keys(s)[0]) } as any))
					);
				}
			}
			// Добавление нового item.
			else {
				const newRawItem: Item = { id: notif.result._id, dbClass: schemeData.scheme.dbClass, ...notif.result._source };
				p.store.items.set(newRawItem.id, newRawItem);
				const sorts = schemeData.scheme.sorts;

				const newItem = p.store.items.get(notif.result._id);
				if (newItem) {
					const items = schemeData.items.concat([newItem]);
					if (sorts) {
						schemeData.items = sort(items).by(
							sorts.map((s) => ({ [Object.values(s)[0]]: (i) => get(i, Object.keys(s)[0]) } as any))
						);
					} else schemeData.items = items;
					schemeData.fetched++;
					schemeData.total++;
				}
			}
		}

		// Удаление существующего item. Нужно удалить прокси как из items, так и из схемы. А так же уменьшить fetched и total.
		if (notif.scope === 'out') {
			p.store.items.delete(notif.result._id);
			schemeData.items = schemeData.items.filter((i) => i.id !== notif.result._id);
			schemeData.fetched--;
			schemeData.total--;
		}
	}

	// Обработаем изменения и отправим их.
	handleDataChanges(p);
};

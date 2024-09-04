import type { DocumentNotification } from 'kuzzle-sdk';
import { getKuzzle } from '@shared/get-kuzzle';
import { dbClassVersion } from '@shared/get-dbclass-version';
import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../node/definition';
import handleDataChanges from './handleDataChanges';
import type { NoodlNode } from '@shared/node-v1.0.0';

export type Notification = DocumentNotification & { result: { _updatedFields: string[] } };
const subDelay = 200;

// Базируется на hash каждой схемы класса.
// Если хеш есть в подписках и есть в данных, значит схема не изменилась - пропускаем.
// Если хеш есть в подписках, но нет в данных, значит старая схема изменилась - отписываемся.
// Если хеша нет в подписках, но есть в данных, значит это новая схема - подписываемся.
export const handleSubscribe = (p: Props) => {
	const schemes = p.store.schemes;
	const subscribes = p.store.subscribes;

	// Обработка подписок с задержкой, чтобы не уткнуться в лимиты.
	// Отписываться нельзя, баш в Kuzzle. handleNotification прововерит схему и не будет тригерить отсутсвующие схемы.
	schemes.forEach((_, schemeHash) => {
		// Подписка на новые схемы.
		if (!subscribes.has(schemeHash)) setTimeout(() => subscribeToScheme(p, schemeHash), subDelay);
	});

	// Отписка от больше не существующих схем.
	/* 	subscribes.forEach((_, schemeHash) => {
		if (!schemes.has(schemeHash)) setTimeout(() => unSubscribeFromScheme(p, schemeHash), subDelay);
	}); */
};

export const subscribe = (p: Props) =>
	p.store.schemes.forEach((_, schemeHash) => setTimeout(() => subscribeToScheme(p, schemeHash)), subDelay);

/* export const unSubscribe = (p: Props) =>
	p.store.subscribes.forEach((_, schemeHash) => setTimeout(() => unSubscribeFromScheme(p, schemeHash)), subDelay); */

export const subscribeToScheme = async (p: Props, schemeHash: string) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;

	const scheme = p.store.schemes.get(schemeHash)?.scheme;
	if (scheme) {
		const dbClassV = dbClassVersion(scheme.dbClass);

		if (dbClassV) {
			K.realtime
				.subscribe(dbName, dbClassV, scheme.filters || {}, (notif) => {
					return;
					//if (notif.type !== 'document') return;
					//handleNotification(p, schemeHash, notif as any);

					//log.info(`Subscribe - ${notif.action} ${scheme.dbClass}: `, notif.result);
				})
				.then((roomId) => {
					p.store.subscribes.set(schemeHash, roomId);

					log.info(`Subscribed to "${scheme.dbClass}"`, scheme);

					//if (scheme.filters?.and?.[1]?.equals?.['object.id'] === 'qHxx-o0B4FHf03Oer2Vz') console.log(`Subscribed`, roomId);
				})
				.catch((error) => log.error(`Subscribe error`, error));
		}
	}
};

/* export const unSubscribeFromScheme = async (p: Props, schemeHash: string) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;

	const scheme = p.store.subscribeShemes.get(schemeHash);
	const roomId = p.store.subscribes.get(schemeHash);

	if (scheme && roomId)
		K.realtime
			.unsubscribe(roomId)
			.then(() => {
				p.store.subscribes.delete(schemeHash);

				log.info(`Unsubscribed from "${scheme.dbClass}"`, scheme);
				if (scheme.filters?.and?.[1]?.equals?.['object.id'] === 'qHxx-o0B4FHf03Oer2Vz') console.log(`Unsubscribed`, roomId);

				p.store.subscribeShemes.delete(schemeHash);
			})
			.catch((error) => log.error(`Unsubscribe error`, error));
}; */

// Поскольку подписки идут по всем схемам, можно обрабатывать item найденный в этой схеме. Дубли отработает тригер другой схемы.
export const handleNotification = (p: Props, noodlNode: NoodlNode, schemeHash: string, notif: Notification) => {
	const sort = R.libs.sort;
	const { get, set } = R.libs.just;

	const schemeData = p.store.schemes.get(schemeHash);
	const itemId = notif.result._id;
	//console.log('notif', notif, schemeData);

	if (schemeData) {
		if (notif.scope === 'in') {
			// Обновление существующего item.
			if (schemeData.itemIds.includes(itemId)) {
				const item = R.items.get(itemId);
				if (item) notif.result._updatedFields.map((field) => set(item, field, get(notif.result._source, field)));

				// Нужно сменить сортировку в itemIds.
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
					id: itemId,
				} as Item;

				R.items.set(newRawItem.id, newRawItem);
				schemeData.itemIds.push(newRawItem.id);

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

		// Удаление существующего item.
		if (notif.scope === 'out') {
			schemeData.itemIds = schemeData.itemIds.filter((id) => id !== itemId);
			schemeData.fetched--;
			schemeData.total--;
		}
	}

	handleDataChanges(p, noodlNode);
};

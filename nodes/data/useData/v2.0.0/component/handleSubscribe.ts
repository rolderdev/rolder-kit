import { getKuzzle } from '@shared/get-kuzzle';
import { dbClassVersion } from '@shared/get-dbclass-version';
import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../node/definition';
import handleDataChanges from './handleDataChanges';
import type { NoodlNode } from '@shared/node-v1.0.0';
import type { DocumentNotification } from '@nodes/app-v2.0.0';
import getIem from './getIem';
import fetchBySub from './fetchBySub';

export type Notification = DocumentNotification & { result: { _updatedFields: string[] } };

// Базируется на hash каждой схемы класса.
// Если хеш есть в подписках и есть в данных, значит схема не изменилась - пропускаем.
// Если хеш есть в подписках, но нет в данных, значит старая схема изменилась - отписываемся.
// Если хеша нет в подписках, но есть в данных, значит это новая схема - подписываемся.
export const handleSubscribe = async (p: Props, noodlNode: NoodlNode) => {
	const schemes = p.store.schemes;
	const subscribes = p.store.subscribes;

	// Отписка от больше не существующих схем.
	subscribes.forEach((_, schemeHash) => {
		if (!schemes.has(schemeHash)) unSubscribeFromScheme(p, schemeHash);
	});

	// Подписка на новые схемы.
	schemes.forEach(async (schemeData, schemeHash) => {
		if (schemeData.channel && !subscribes.has(schemeHash)) subscribeOnScheme(p, noodlNode, schemeHash, schemeData.channel);
	});
};

export const unsubscribe = (p: Props) => p.store.subscribes.forEach((_, schemeHash) => unSubscribeFromScheme(p, schemeHash));

const subscribeOnScheme = async (p: Props, noodlNode: NoodlNode, schemeHash: string, channel: string) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;

	const scheme = p.store.schemes.get(schemeHash)?.scheme;
	if (scheme) {
		const dbClass = typeof scheme.dbClass === 'string' ? scheme.dbClass : scheme.dbClass.name;
		const dbClassV = dbClassVersion(dbClass);

		if (dbClassV) {
			const notify = (notif: Notification) => {
				//console.log('server notif', schemeHash, notif);

				if (notif.type !== 'document') return;
				handleNotification(p, noodlNode, schemeHash, notif);

				log.info(`Subscribe - ${notif.action} ${scheme.dbClass}: `, notif.result);
			};

			K.protocol.on(channel, notify);

			p.store.subscribes.set(schemeHash, { channel, notify });
			log.info(`Subscribed to "${scheme.dbClass}"`, { schemeHash, scheme });
		}
	}
};

const unSubscribeFromScheme = async (p: Props, schemeHash: string) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;

	const unsub = p.store.subscribes.get(schemeHash);
	if (unsub) {
		K.protocol.removeListener(unsub.channel, unsub.notify);
		p.store.subscribes.delete(schemeHash);

		log.info(`Unsubscribed from schemeHash "${schemeHash}"`);
	}
};

// Поскольку подписки идут по всем схемам, можно обрабатывать item найденный в этой схеме. Дубли отработает тригер другой схемы.
export const handleNotification = async (p: Props, noodlNode: NoodlNode, schemeHash: string, notif: Notification) => {
	const sort = R.libs.sort;
	const { get, set } = R.libs.just;

	const schemeData = p.store.schemes.get(schemeHash);
	const itemId = notif.result._id;

	if (schemeData) {
		if (notif.scope === 'in') {
			// Обновление существующего item.
			if (schemeData.itemIds.includes(itemId)) {
				const item = R.items[itemId];

				// Здесь кастомное решение, т.к. Kuzzle не отправляет, что удалил.
				if (item) {
					// Если было удаление ключей.
					if (notif.volatile.deleteFields) notif.volatile.deleteFields.forEach((i: string) => R.libs.lodash.unset(item, i));
					notif.result._updatedFields?.map((field) => set(item, field, get(notif.result._source, field)));
				}

				// Нужно сменить сортировку в itemIds.
				const sorts = schemeData.scheme.sorts;
				if (sorts) {
					let items = schemeData.itemIds.map((id) => R.items[id]).filter((i) => i !== undefined);
					items = sort(items).by(sorts.map((s) => ({ [Object.values(s)[0]]: (i: any) => get(i, Object.keys(s)[0]) } as any)));
					schemeData.itemIds = items.map((i) => i.id);
				}
			} else {
				// Добавление нового item.
				const newRawItem = getIem(
					{
						...notif.result._source,
						dbClass: schemeData.scheme.dbClass,
						id: itemId,
					} as Item,
					p.store.rootId
				);

				const item = R.items[itemId];
				if (!item) R.items[newRawItem.id] = newRawItem;
				else R.libs.lodash.merge(item, newRawItem);

				schemeData.itemIds.push(newRawItem.id);

				// Нужно сменить сортировку в itemIds.
				const sorts = schemeData.scheme.sorts;
				if (sorts) {
					let items = schemeData.itemIds.map((id) => R.items[id]).filter((i) => i !== undefined);
					items = sort(items).by(sorts.map((s) => ({ [Object.values(s)[0]]: (i: any) => get(i, Object.keys(s)[0]) } as any)));
					schemeData.itemIds = items.map((i) => i.id);
				}
				schemeData.fetched++;
				schemeData.total++;

				// Костылечег. При добавлении нужно создать новую серверную схему и подписаться на нее.
				// При этом, не понятно как это сделать точечно. Поэтому делаем простую перезагрузку, но без тригеров и обновления выходов.
				// Так сервер подпишет на новые схемы, которые породил новый item.
				// Хоть и костыль, но без тормозов, т.к. весь код выше уже все сделал для фронта, а handleDataChanges тригернул все, что нужно.
				fetchBySub(p, noodlNode);
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

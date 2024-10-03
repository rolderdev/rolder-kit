import { getKuzzle } from '@shared/get-kuzzle';
import { getDbClassName, getVersionedDbClass } from '@shared/db-class';
import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../node/definition';
import handleDataChanges from './handleDataChanges';
import type { NoodlNode } from '@shared/node-v1.0.0';
import type { DocumentNotification } from '@nodes/app-v2.0.0';
import fetchBySub from './fetchBySub';
import setItem from './setItem';

export type Notification = DocumentNotification & { result: { _updatedFields: string[] } };

// Базируется на hash каждой схемы класса.
// Если хеш есть в подписках и есть в данных, значит схема не изменилась - пропускаем.
// Если хеш есть в подписках, но нет в данных, значит старая схема изменилась - отписываемся.
// Если хеша нет в подписках, но есть в данных, значит это новая схема - подписываемся.
export const handleSubscribe = async (p: Props, noodlNode: NoodlNode) => {
	// Нужно убрать дубли, чтобы не повторять подписки.
	const schemesData = R.libs.remeda.uniqueWith(p.store.schemesData, (a, b) => a.schemeHash === b.schemeHash);
	const subscribes = p.store.subscribes;

	// Отписка от больше не существующих схем.
	subscribes.forEach((_, schemeHash) => {
		if (!schemesData.find((i) => i.schemeHash === schemeHash)) unSubscribeFromScheme(p, schemeHash);
	});

	// Подписка на новые схемы.
	schemesData.forEach(async (schemeData) => {
		if (schemeData.channel && !subscribes.has(schemeData.schemeHash))
			subscribeOnScheme(p, noodlNode, schemeData.schemeHash, schemeData.channel);
	});
};

export const unsubscribe = (p: Props) => p.store.subscribes.forEach((_, schemeHash) => unSubscribeFromScheme(p, schemeHash));

const subscribeOnScheme = async (p: Props, noodlNode: NoodlNode, schemeHash: string, channel: string) => {
	const { dbName } = window.R.env;
	if (!dbName) return;

	const K = await getKuzzle();
	if (!K) return;

	const scheme = p.store.schemesData.find((i) => i.schemeHash === schemeHash)?.scheme;
	if (scheme) {
		const dbClassName = getDbClassName(scheme.dbClass);
		const dbClassV = getVersionedDbClass(scheme.dbClass);

		if (dbClassV) {
			const notify = (notif: Notification) => {
				//console.log('server notif', schemeHash, notif);
				if (notif.type !== 'document') return;
				handleNotification(p, noodlNode, schemeHash, notif);

				log.info(`Subscribe - ${notif.action} ${dbClassName}: `, notif.result);
			};

			K.protocol.on(channel, notify);

			p.store.subscribes.set(schemeHash, { channel, notify });
			log.info(`Subscribed to "${dbClassName}"`, { schemeHash, scheme });
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
	const { get } = R.libs.just;

	const schemesData = p.store.schemesData.filter((i) => i.schemeHash === schemeHash);
	const itemId = notif.result._id;

	if (schemesData?.length) {
		const rawItem = {
			...notif.result._source,
			dbClass: getDbClassName(schemesData[0].scheme.dbClass),
			id: itemId,
		} as Item;

		if (notif.scope === 'in') {
			// Обновление существующего item.
			if (schemesData[0].itemIds.includes(itemId)) {
				const item = R.items[itemId];

				if (item) setItem(rawItem, p.store.rootId);

				// Нужно сменить сортировку в itemIds.
				const sorts = schemesData[0].scheme.sorts;
				if (sorts) {
					let items = schemesData[0].itemIds.map((id) => R.items[id]).filter((i) => i !== undefined);
					items = sort(items).by(sorts.map((s) => ({ [Object.values(s)[0]]: (i: any) => get(i, Object.keys(s)[0]) } as any)));
					schemesData.forEach((d) => (d.itemIds = items.map((i) => i.id)));
				}
			} else {
				// Добавление нового item.
				setItem(rawItem, p.store.rootId);
				schemesData.forEach((d) => d.itemIds.push(rawItem.id));

				// Нужно сменить сортировку в itemIds.
				const sorts = schemesData[0].scheme.sorts;
				if (sorts) {
					let items = schemesData[0].itemIds.map((id) => R.items[id]).filter((i) => i !== undefined);
					items = sort(items).by(sorts.map((s) => ({ [Object.values(s)[0]]: (i: any) => get(i, Object.keys(s)[0]) } as any)));
					schemesData.forEach((d) => (d.itemIds = items.map((i) => i.id)));
				}
				schemesData.forEach((d) => d.fetched++);
				schemesData.forEach((d) => d.total++);

				// Костылечег. При добавлении нужно создать новую серверную схему и подписаться на нее.
				// При этом, не понятно как это сделать точечно. Поэтому делаем простую перезагрузку, но без тригеров и обновления выходов.
				// Так сервер подпишет на новые схемы, которые породил новый item.
				// Хоть и костыль, но без тормозов, т.к. весь код выше уже все сделал для фронта, а handleDataChanges тригернул все, что нужно.
				fetchBySub(p, noodlNode);
			}
		}

		// Удаление существующего item.
		if (notif.scope === 'out') {
			schemesData.forEach((d) => (d.itemIds = d.itemIds.filter((id) => id !== itemId)));
			schemesData.forEach((d) => d.fetched++);
			schemesData.forEach((d) => d.total++);
		}
	}

	handleDataChanges(p, noodlNode);
};

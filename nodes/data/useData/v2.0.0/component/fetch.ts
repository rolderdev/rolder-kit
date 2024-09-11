import { getKuzzle } from '@shared/get-kuzzle';
import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';
import type { JSONObject, ResponsePayload } from '@nodes/data-v2.0.0';
import handleDataChanges from './handleDataChanges';
import type { SchemeData } from '../node/store';
import type { Props } from '../node/definition';
import type { NoodlNode } from '@shared/node-v1.0.0';
import getIemMethods from './getIemMethods';
import { handleSubscribe } from './handleSubscribe';

export type BackendData = {
	items: { [id: string]: Item };
	itemsHistory: ItemsHistory;
	schemes: { [schemeHash: string]: SchemeData };
	error?: { message: string; dbClass?: string; metaData: any };
};

export type ItemsHistory = Record<string, HistoryItem[]>;

export type HistoryItem = {
	timestamp: number;
	item: Item;
};

export const fetch = async (p: Props, noodlNode: NoodlNode) => {
	const K = await getKuzzle();
	if (!K) return;

	const MantineError = R.libs.mantine?.MantineError;

	const { dbName } = R.env;
	if (!dbName) {
		MantineError?.('Системная ошибка!', `No dbName at R.env`);
		log.error('No dbName', R.env);
		return;
	}

	const { has, map } = R.libs.just;
	const fetchScheme = p.store.fetchScheme;

	if (!fetchScheme) return;

	const startTime = log.start();
	log.info(`useData props: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, p);

	sendOutput(noodlNode, 'fetching', true);

	let response: ResponsePayload<JSONObject> | undefined;

	try {
		response = await K.query({
			controller: 'rolder',
			action: `fetch_${p.store.apiVersion}`,
			dbName,
			fetchScheme,
			subscribe: p.subscribe,
		});

		// Отловим ошибки.
	} catch (e: any) {
		log.error('useData fetch error.', e);
		MantineError?.('Системная ошибка!', `useData fetch error: ${e.message}`);
		return;
	}

	const data = response?.result as BackendData;

	if (data.error) {
		log.error('Kuzzle error.', data.error);
		MantineError?.('Системная ошибка!', `Kuzzle error. ${data.error.message}`);
	}

	// Обновим хранилище схем для иерархи и серверных подписок.
	// Каждая схема имеет свой список itemIds. В нем не могут совпадать id, но могут глобально.
	map(data.schemes, (schemeHash, schemeData) => p.store.schemes.set(schemeHash, schemeData));
	p.store.schemes.forEach((_, schemeHash) => !has(data.schemes, schemeHash) && p.store.schemes.delete(schemeHash));

	// Запустим подписку на схемы.
	if (p.subscribe) handleSubscribe(p, noodlNode);

	// Обновим items.
	map(data.items, (itemId, item) => {
		// Добавим методы.
		item = { ...item, ...(getIemMethods(itemId) as any) };

		// Здесь безопсно класть в прокси item с бекенда как есть, без клонирования, т.к. data.items никогда не мутируется.
		const proxyItem = R.items[itemId];
		if (!proxyItem) R.items[itemId] = item;
		else R.libs.lodash.merge(proxyItem, item);
	});

	// Обновим историю items.
	map(data.itemsHistory, (itemId, historyItems) => {
		const itemHistoryProxy = R.itemsHistory[itemId];
		if (!itemHistoryProxy) R.itemsHistory[itemId] = historyItems;
		// Нужно учесть, что в истории могут быть совпадения, значит нужно обновлять их.
		// Сортировать не нужно, т.к. сервер это сделал. При добавлении новых, массив отработает в нужном порядке и push положит как надо.
		else
			historyItems.forEach((i, idx) => {
				if (!itemHistoryProxy.map((i) => i.item.id).includes(i.item.id)) itemHistoryProxy.push(i);
				else itemHistoryProxy[idx] = i;
			});
	});

	// Подготовим и отправим данные.
	handleDataChanges(p, noodlNode);

	log.info(`useData: ${fetchScheme?.map((i) => i.dbClass).join(', ')}`, data);
	log.end(`useData: ${fetchScheme?.map((i) => i.dbClass).join(', ')}`, startTime);
};

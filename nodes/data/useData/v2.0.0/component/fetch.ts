import { getKuzzle } from '@shared/get-kuzzle';
import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';
import type { JSONObject, ResponsePayload } from 'kuzzle-sdk';
import handleDataChanges from './handleDataChanges';
import type { SchemeData } from '../node/store';
import type { Props } from '../node/definition';
import type { NoodlNode } from '@shared/node-v1.0.0';

export type BackendData = {
	items: { [id: string]: Item };
	schemes: { [schemeHash: string]: SchemeData };
	error?: { message: string; dbClass?: string; metaData: any };
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
	const { fetchScheme, apiVersion } = p.store;

	if (!fetchScheme) return;

	const startTime = log.start();
	log.info(`useData props: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, p);

	sendOutput(noodlNode, 'fetching', true);

	let response: ResponsePayload<JSONObject> | undefined;

	// Отловим неавторизованную сессию здесь дополнительно, т.к. useData в отличии от UseData вполне может запуститься до проверки авторизации.
	try {
		response = await K.query({ controller: 'rolder', action: `fetch_${apiVersion}`, dbName, fetchScheme });
	} catch (e: any) {
		log.error('useData fetch error.', e);
		if (e.code === 117506049) R.db?.states.auth?.set('signedIn', () => false);
		return;
	}

	const data = response?.result as BackendData;

	if (data.error) {
		log.error('Kuzzle error.', { error: data.error.message, metaData: data.error.metaData });
		MantineError?.('Системная ошибка!', `Kuzzle error. ${data.error.message}`);
	}

	// Обновим items. Нужно сохранить во временном хранилище, т.к. выдавать их глобально нужно после построения иерархии.
	map(data.items, (itemId, item) => {
		item.getRef = (dbClass) => {
			const globalItem = R.items.get(itemId);
			if (globalItem && globalItem[dbClass]) {
				if (Array.isArray(globalItem[dbClass])) return globalItem[dbClass].map((i) => R.items.get(i.id)).filter((i) => !!i);
				else return R.items.get(globalItem[dbClass].id);
			} else return undefined;
		};
		p.store.items.set(itemId, item);
	});

	// Обновим хранилище схем для иерархи и серверных подписок.
	// Каждая схема имеет свой список itemIds. В нем не могут совпадать id, но могут глобально.
	map(data.schemes, (schemeHash, schemeData) => p.store.schemes.set(schemeHash, schemeData));
	p.store.schemes.forEach((_, schemeHash) => !has(data.schemes, schemeHash) && p.store.schemes.delete(schemeHash));

	// Подготовим и отправим данные.
	handleDataChanges(p, noodlNode);

	log.info(`useData: ${fetchScheme?.map((i) => i.dbClass).join(', ')}`, data);
	log.end(`useData: ${fetchScheme?.map((i) => i.dbClass).join(', ')}`, startTime);
};

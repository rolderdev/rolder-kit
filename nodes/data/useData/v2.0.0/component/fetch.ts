import { getKuzzle } from '@shared/get-kuzzle';
import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Props } from '../types';
import handleDataChanges from './handleDataChanges';
import type { Item } from '@shared/types-v0.1.0';
import type { SchemeData } from '../node/store';

export type BackendData = {
	items: { [id: string]: Item };
	schemes: { [schemeHash: string]: SchemeData };
	error?: { message: string; dbClass?: string; metaData: any };
};

export const fetch = async (p: Props) => {
	const K = await getKuzzle();
	if (!K) return;

	const MantineError = R.libs.mantine?.MantineError;

	const { dbName } = R.env;
	if (!dbName) {
		MantineError?.('Системная ошибка!', `No dbName at R.env`);
		log.error('No dbName', R.env);
		return;
	}

	const { fetchScheme } = p.store;

	const startTime = log.start();
	log.info(`useData props: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, p);

	sendOutput(p.noodlNode, 'fetching', true);

	const response = await K.query({ controller: 'rolder', action: `fetch_${p.apiVersion}`, dbName, fetchScheme });
	const data = response.result as BackendData;

	if (data.error) {
		log.error('Kuzzle error.', { error: data.error.message, metaData: data.error.metaData });
		MantineError?.('Системная ошибка!', `Kuzzle error. ${data.error.message}`);
	}

	// Обновим не реактивное хранилище items.
	R.libs.just.map(data.items, (itemId, item) => p.store.data.items.set(itemId, item));
	p.store.data.items.forEach((_, itemId) => !R.libs.just.has(data.items, itemId) && p.store.data.schemes.delete(itemId));

	// Обновим не реактивное хранилище схем. Каждая схема имеет свой список itemIds. В нем не могут совпадать id, но могут глобально.
	R.libs.just.map(data.schemes, (schemeHash, schemeData) => p.store.data.schemes.set(schemeHash, schemeData));
	p.store.data.schemes.forEach(
		(_, schemeHash) => !R.libs.just.has(data.schemes, schemeHash) && p.store.data.schemes.delete(schemeHash)
	);

	handleDataChanges(p); // Подготовим данные для отправки и отправим их.

	log.info(`useData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, data);
	log.end(`useData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, startTime);

	return;
};

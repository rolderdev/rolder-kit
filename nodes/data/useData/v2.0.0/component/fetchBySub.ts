import { getKuzzle } from '@shared/get-kuzzle';
import type { JSONObject, ResponsePayload } from '@nodes/app-v2.0.0';
import type { Props } from '../node/definition';
import type { NoodlNode } from '@shared/node-v1.0.0';
import { handleSubscribe } from './handleSubscribe';
import type { BackendData } from './fetch';

export default async (p: Props, noodlNode: NoodlNode) => {
	const K = await getKuzzle();
	if (!K) return;

	const { dbName } = R.env;
	if (!dbName) return;

	const { has, map } = R.libs.just;
	const fetchScheme = p.store.fetchScheme;

	if (!fetchScheme) return;

	let response: ResponsePayload<JSONObject> | undefined;

	try {
		response = await K.query({
			controller: 'rolder',
			action: `fetch_${p.store.apiVersion}`,
			dbName,
			fetchScheme,
			subscribe: p.subscribe,
		});
	} catch (e: any) {
		log.error('useData fetch error.', e);
		return;
	}

	const data = response?.result as BackendData;

	if (data.error) log.error('Kuzzle error.', data.error);

	map(data.schemes, (schemeHash, schemeData) => p.store.schemes.set(schemeHash, schemeData));
	p.store.schemes.forEach((_, schemeHash) => !has(data.schemes, schemeHash) && p.store.schemes.delete(schemeHash));

	// Запустим подписку на схемы.
	if (p.subscribe) handleSubscribe(p, noodlNode);
};

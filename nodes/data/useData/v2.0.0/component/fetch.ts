import { getKuzzle } from '@shared/get-kuzzle';
import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Props } from '../types';
import handleDataChanges from './handleDataChanges';

export const fetch = async (p: Props) => {
	const K = await getKuzzle();
	if (!K) return;

	const { dbName } = R.env;
	if (!dbName) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`);
		log.error('No dbName', R.env);
		return;
	}

	const { map, omit } = R.libs.just;

	const { fetchScheme } = p.store;

	const startTime = log.start();
	log.info(`useData props: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, p);

	sendOutput(p.noodlNode, 'fetching', true);

	const response = await K.query({ controller: 'rolder', action: `fetch_${p.apiVersion}`, dbName, fetchScheme });
	const data = response.result;

	map(data, (dbClassOrError, v) => {
		// Когда нет конкретной ошибки класса, контроллер выдает 'General error'.
		if (dbClassOrError === 'error') {
			log.error('useData error:', v);
			R.libs.mantine?.MantineError('Системная ошибка!', `useData error. ${v}`);
		}
		// Ошибки классов.
		if (v.error) {
			log.error(`useData error at "${dbClassOrError}"`, v.error);
			R.libs.mantine?.MantineError('Системная ошибка!', `useData error at "${dbClassOrError}". ${v.error}`);
		}
	});

	// Подготовим items и схемы.
	p.store.items.clear();
	Object.values(data.items).map((i: any) => p.store.items.set(i.id, i));

	p.store.schemes.clear();
	map(data.schemes, (schemeHash, v: any) =>
		p.store.schemes.set(schemeHash, {
			...omit(v, ['itemIds']),
			items: v.itemIds.map((id) => p.store.items.get(id)),
		} as any)
	);

	// Подготовим связи, иерархию, данные для отправки и отправим их.
	handleDataChanges(p);

	log.info(`useData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, data);
	log.end(`useData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, startTime);

	return;
};

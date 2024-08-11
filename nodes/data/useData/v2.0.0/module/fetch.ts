import { getKuzzle } from '@packages/get-kuzzle';
import type { Props } from '../types';
import { sendOutput, sendSignal } from '@packages/port-send';

export const fetch = async (p: Props) => {
	const K = await getKuzzle();
	if (!K) return;

	const { dbName } = R.env;
	if (!dbName) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`);
		log.error('No dbName', R.env);
		return;
	}

	const { fetchScheme } = p.store.get();

	const startTime = log.start();
	log.info(`useData props: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, p);

	sendOutput(p.noodlNode, 'fetching', true);

	const response = await K.query({ controller: 'rolder', action: `fetch_${p.apiVersion}`, dbName, fetchScheme });
	const data = response.result;
	const dataEntries = Object.entries(data);
	if (dataEntries.some((i) => i[1].error))
		dataEntries.forEach((entry) => {
			if (entry[1]?.error) {
				R.libs.mantine?.MantineError('Системная ошибка!', `useData error at "${entry[0]}": ${entry[1]?.error}`);
				log.error(`useData error at "${entry[0]}": ${entry[1]?.error}`);
			}
		});

	/* Object.keys(data).map((dbClass) => {
		sendOutput(p.noodlNode, `${dbClass}Items`, data[dbClass].items);
		sendOutput(p.noodlNode, `${dbClass}Fetched`, data[dbClass].fetched);
		sendOutput(p.noodlNode, `${dbClass}Total`, data[dbClass].total);
		sendOutput(p.noodlNode, `${dbClass}Aggregations`, data[dbClass].aggregations);
	}); */
	sendOutput(p.noodlNode, `data`, data);
	sendOutput(p.noodlNode, 'fetching', false);
	sendSignal(p.noodlNode, 'fetched');

	log.info(`useData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, data);
	log.end(`useData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, startTime);

	return;
};

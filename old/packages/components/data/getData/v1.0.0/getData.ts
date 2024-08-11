import type { FetchScheme, Props } from './types';
import { getKuzzle } from '@packages/get-kuzzle';
import clone from 'just-clone';
import { sendOutput, sendSignal } from '@packages/port-send';

function schemeValid(scheme: FetchScheme[number]): boolean {
	if (!scheme.dbClass) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbClass at scheme: ${JSON.stringify(scheme)}`);
		log.error('`No dbClass at scheme', scheme);
		return false;
	}

	return true;
}

function getFetchScheme(fetchScheme: FetchScheme) {
	let hasErrors = false;
	let resultScheme: FetchScheme = clone(fetchScheme);
	resultScheme.forEach((dbClassScheme) => {
		hasErrors = !schemeValid(dbClassScheme);
	});

	return hasErrors ? false : resultScheme;
}

export default {
	async getData(props: Props) {
		const K = await getKuzzle();
		if (!K) {
			return null;
		}

		const { dbName } = R.env;
		if (!dbName) {
			R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`);
			log.error('No dbName', R.env);
			return null;
		}

		const fetchScheme = getFetchScheme(props.fetchScheme);
		if (!fetchScheme) {
			return null;
		}

		const startTime = log.start();
		log.info(`GetData props: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, props);

		sendOutput(props.noodlNode, 'fetching', true);

		const r = await K.query({ controller: 'rolder', action: 'fetch', dbName, fetchScheme });
		const data = r.result;
		const dataEntries = Object.entries(data);
		if (dataEntries.some((i) => i[1].error)) {
			dataEntries.forEach((entry) => {
				if (entry[1]?.error) {
					R.libs.mantine?.MantineError('Системная ошибка!', `UseData error at "${entry[0]}": ${entry[1]?.error}`);
					log.error(`UseData error at "${entry[0]}": ${entry[1]?.error}`);
				}
			});
		}

		Object.keys(data).map((dbClass) => {
			sendOutput(props.noodlNode, `${dbClass}Items`, data[dbClass].items);
			sendOutput(props.noodlNode, `${dbClass}Fetched`, data[dbClass].fetched);
			sendOutput(props.noodlNode, `${dbClass}Total`, data[dbClass].total);
			sendOutput(props.noodlNode, `${dbClass}Aggregations`, data[dbClass].aggregations);
		});
		sendOutput(props.noodlNode, `data`, data);
		sendOutput(props.noodlNode, 'fetching', false);
		sendSignal(props.noodlNode, 'fetched');

		log.info(`getData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, data);
		log.end(`getData: ${fetchScheme.map((i) => i.dbClass).join(', ')}`, startTime);
		return;
	},
};

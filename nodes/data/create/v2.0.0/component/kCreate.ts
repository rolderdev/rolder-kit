import { getKuzzle } from '@shared/get-kuzzle';
import type { Item } from '@shared/types-v0.1.0';
import type { JSONObject, ResponsePayload } from '@nodes/app-v2.0.0';
import type { Props } from '../node/definition';
import type { CreateScheme } from '../node/validtaion';

export type BackendData = {
	data: { [dbClass: string]: { items: Item[]; count: number } };
	error?: { message: string; dbClass?: string; metaData: any };
};

export default async (p: Props, createScheme: CreateScheme) => {
	const K = await getKuzzle();
	if (!K) return;

	const MantineError = R.libs.mantine?.MantineError;

	const { dbName } = R.env;
	if (!dbName) {
		MantineError?.('Системная ошибка!', `No dbName at R.env`);
		log.error('No dbName', R.env);
		return;
	}

	const startTime = log.start();
	log.info(`create props: ${createScheme.map((i) => i.dbClass).join(', ')}`, p);

	let response: ResponsePayload<JSONObject> | undefined;

	try {
		response = await K.query({ controller: 'rolder', action: `create_${p.apiVersion}`, dbName, createScheme });

		// Отловим ошибки.
	} catch (e: any) {
		log.error('create query error.', e);
		MantineError?.('Системная ошибка!', `create query error: ${e.message}`);
		return;
	}

	const backendData = response?.result as BackendData;

	if (backendData.error) {
		log.error('Kuzzle error.', backendData.error);
		MantineError?.('Системная ошибка!', `Kuzzle error. ${backendData.error.message}`);
	}

	log.info(`create: ${createScheme?.map((i) => i.dbClass).join(', ')}`, backendData);
	log.end(`create: ${createScheme?.map((i) => i.dbClass).join(', ')}`, startTime);

	return backendData.data;
};

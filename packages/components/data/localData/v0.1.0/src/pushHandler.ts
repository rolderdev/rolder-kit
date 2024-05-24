import { getKuzzle } from '@packages/get-kuzzle';
import type { RxReplicationWriteToMasterRow } from 'rxdb';

export default async function pushHandler(dbClass: string, changeRows: RxReplicationWriteToMasterRow<any>[]) {
	const K = await getKuzzle();
	if (!K) {
		return Promise.reject();
	}

	const { dbName } = R.env;
	if (!dbName) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No dbName at R.env`);
		log.error('No dbName', R.env);
		return Promise.reject();
	}

	const response = await K.query({
		controller: 'rolder',
		action: 'push',
		dbName,
		dbClass,
		changeItems: changeRows
	});

	const conflicts = response.result as any[];
	log.info('Push conflicts', conflicts);

	return conflicts;
}

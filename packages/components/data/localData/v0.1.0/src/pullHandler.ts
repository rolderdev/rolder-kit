import { getKuzzle } from '@packages/get-kuzzle';
import last from 'just-last';
import type { ReplicationPullHandlerResult } from 'rxdb';
import type { Item } from 'types';
import { dbClassVersion } from '@packages/get-dbclass-version';
import clone from 'just-clone';

export default async function pullHandler(
	checkpoint: { id: string; updatedAt?: number } | undefined,
	dbClass: string,
	fetchScheme: any[]
): Promise<ReplicationPullHandlerResult<any, any>> {
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

	const dbClassV = dbClassVersion(dbClass);
	if (!dbClassV) return Promise.reject();

	const startTime = performance.now();

	let fs: any = clone(fetchScheme);

	fs = fs.map((i: any) => {
		i.sorts = [{ '_kuzzle_info.updatedAt': 'asc' }, { '_kuzzle_info.createdAt': 'asc' }];

		if (i.dbClass === dbClass && checkpoint?.updatedAt) {
			if (i.filters?.and) {
				i.filters.and.push({
					or: [
						{ range: { '_kuzzle_info.updatedAt': { gt: checkpoint.updatedAt } } },
						{ range: { '_kuzzle_info.createdAt': { gt: checkpoint.updatedAt } } }
					]
				});
			} else {
				i.filters = {
					or: [
						{ range: { '_kuzzle_info.updatedAt': { gt: checkpoint.updatedAt } } },
						{ range: { '_kuzzle_info.createdAt': { gt: checkpoint.updatedAt } } }
					]
				};
			}
		}

		return i;
	});

	const response = await K.query({ controller: 'rolder', action: 'fetchAll', dbName, fetchScheme: fs });
	const items: Item[] = response.result[dbClass].items;

	const newCheckpoint = {
		id: items.length === 0 ? checkpoint?.id : last(items).id,
		updatedAt: items.length === 0 ? checkpoint?.updatedAt : last(items)?.sysinfo.updatedAt || last(items)?.sysinfo.createdAt
	};

	await R.db?.states.replication.set(dbClass, () => true);

	log.end(`${dbClass} replicated`, startTime);
	log.info(`${dbClass} replicated`, { newItems: items });

	return {
		documents: items,
		checkpoint: newCheckpoint
	};
}

import { getKuzzle } from '@packages/get-kuzzle';
import flush from 'just-flush';
import last from 'just-last';
import type { ReplicationPullHandlerResult } from 'rxdb';
import type { Item } from 'types';

export default async function pullHandler(
	checkpoint: { id: string; updatedAt?: number; scrollId?: string } | undefined,
	batchSize: number
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

	const sort = [{ '_kuzzle_info.updatedAt': 'desc' }, { _id: 'desc' }];
	let query: any = {};
	const options = { size: batchSize, sort, lang: 'koncorde', scroll: '60s' };
	let response: any = {};

	// first run
	if (!checkpoint?.scrollId && !checkpoint?.updatedAt) {
		console.log('first run', checkpoint);
		response = await K.document.search(dbName, 'task_v5', { query }, options);
	}

	// rerun
	if (!checkpoint?.scrollId && checkpoint?.updatedAt) {
		console.log('rerun', checkpoint);
		query.range = { '_kuzzle_info.updatedAt': { gt: checkpoint.updatedAt } };
		response = await K.document.search(dbName, 'task_v5', { query }, options);
	}

	// kuzzle scroll
	if (checkpoint?.scrollId) {
		console.log('kuzzle scroll', checkpoint);
		response = await K.query({
			controller: 'document',
			action: 'scroll',
			scrollId: checkpoint.scrollId
		});
	}

	const hits = response.result?.hits || response.hits;
	const items: Item[] = hits.map((i: any) => {
		let item = {
			id: i._id,
			sysinfo: flush(i._source._kuzzle_info)
		};
		delete i._id;
		delete i._source._kuzzle_info;
		item = { ...item, ...i._source };
		return item;
	});

	console.log('items', items);

	const newCheckpoint =
		items.length === 0
			? {
					id: checkpoint?.id,
					updatedAt: checkpoint?.updatedAt,
					scrollId: undefined
			  }
			: {
					id: last(items).id,
					updatedAt: last(items).sysinfo.updatedAt || last(items).sysinfo.createdAt,
					scrollId: response.result?.scrollId as string
			  };

	console.log('newCheckpoint', newCheckpoint);
	return {
		documents: items,
		checkpoint: newCheckpoint
	};
}

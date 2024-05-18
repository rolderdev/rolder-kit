import map from 'just-map-object';
import type { Props } from '../types';

export default async function (collectionsDefinition: Props['collectionsDefinition']) {
	const { db } = R;

	if (!db) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No db at R`);
		log.error('No db at R', R);
		return Promise.reject();
	}

	const collections = await db.addCollections(collectionsDefinition);
	map(collections, (_, collection) => {
		// kuzzle will overwrite it to be one point of proof
		collection.preSave(function (plainData) {
			plainData.sysinfo.updatedAt = new Date().valueOf();
		}, false);
	});

	return collections;
}

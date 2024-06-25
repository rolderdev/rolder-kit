import initReplication from './initReplication';
import type { Props } from '../types';
import { getKuzzle } from '@packages/get-kuzzle';
import initCollections from './initCollections';
import map from 'just-map-object';
import type { RxCollection } from 'rxdb';

export default async function (
	collectionsDefinition: Props['collectionsDefinition'],
	dbParams: {
		environment: string;
		backendDevMode?: boolean;
		backendHost?: string;
	}
) {
	const { project } = Noodl.getProjectSettings();
	const { environment, backendDevMode, backendHost } = dbParams;

	const composedPullsStremUrl = backendDevMode
		? `http://${backendHost}:8512` || 'http://localhost:8512'
		: `https://${project}.pullstream.${environment}.rolder.app`;

	const collections = await initCollections(collectionsDefinition);
	let replicationCollections: { [x: string]: RxCollection<any, {}, {}, {}, any> } = {};
	map(collectionsDefinition, async (dbClass, collectionDefinition) => {
		if (collectionDefinition.replication !== false) replicationCollections[dbClass] = collections[dbClass];
	});

	const K = await getKuzzle();
	// online
	if (K) {
		log.info('Local data DB started with online mode', collectionsDefinition);

		const intervalId = setInterval(() => {
			if (K.jwt) {
				clearInterval(intervalId);
				initReplication(composedPullsStremUrl, replicationCollections, collectionsDefinition);
			}
		}, 100);

		// offline
	} else {
		log.info('Local data DB started with offline mode', collectionsDefinition);
	}
}

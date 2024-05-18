import { Http, Kuzzle } from 'kuzzle-sdk';
import initReplication from './initReplication';
import type { Props } from '../types';

export default async function (
	collectionsDefinition: Props['collectionsDefinition'],
	dbParams: {
		environment: string;
		backendDevMode?: boolean;
		backendHost?: string;
		backendPort?: number;
		multiInstance?: boolean;
	}
) {
	const { project } = Noodl.getProjectSettings();
	const { environment, backendDevMode, backendHost, backendPort } = dbParams;

	const composedBackendUrl = backendDevMode ? backendHost || 'localhost' : `${project}.kuzzle.${environment}.rolder.app`;
	const composedBackendPort = backendDevMode ? backendPort || 7512 : 443;
	const composedPullsStremUrl = backendDevMode
		? `http://${backendHost}:8512/_/pullStream` || 'http://localhost:8512/_/pullStream'
		: `${project}.kuzzle.${environment}.rolder.app:8512/_/pullStream`;

	//	const collections = await initCollections(collectionsDefinition);

	const kuzzle = new Kuzzle(new Http(composedBackendUrl, { port: composedBackendPort }), { cookieAuth: true });
	R.libs.Kuzzle = kuzzle;

	await kuzzle.connect();
	//R.states.backend = 'initialized';

	//initReplication(composedPullsStremUrl, collections);
}

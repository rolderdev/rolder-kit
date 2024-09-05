import type { Props } from './definition';
import setConfig from './setConfig';
import { sendSignal } from '@shared/port-send-v1.0.0';
import { Kuzzle, WebSocket } from 'kuzzle-sdk';
import systemLoaderAnimation from '@shared/system-loader-animation-v0.1.0';
import type { NoodlNode } from '@shared/node-v1.0.0';

export default async (p: Props, noodlNode: NoodlNode) => {
	const { dbName, backendDevMode, backendUrl, backendPort } = p;
	const { project, stopLoaderAnimationOn = 'authInitialized', environment = 'd2' } = Noodl.getProjectSettings();

	R.env.dbName = dbName;

	if (!project || !environment) {
		log.error('Kuzzle init: empty required props', { project, environment });
		return;
	}

	const startTime = log.start();
	const host = backendDevMode ? backendUrl || 'localhost' : `${project}.kuzzle.${environment}.rolder.app`;
	const port = backendDevMode ? backendPort || 7512 : 443;
	noodlNode._internal.host = host;
	noodlNode._internal.port = port;

	const kuzzle = new Kuzzle(new WebSocket(host, { port }));

	if (R.db?.states.network.connected) {
		await kuzzle.connect();
		await setConfig(kuzzle, true);

		log.end('Kuzzle online init', startTime);
	} else {
		await setConfig(kuzzle, false);
		log.end('Kuzzle offline init', startTime);
	}

	R.libs.Kuzzle = kuzzle;
	noodlNode.innerReactComponentRef?.setInitState(true);
	sendSignal(noodlNode, 'initialized');

	log.info('R', R);

	if (stopLoaderAnimationOn === 'authInitialized') systemLoaderAnimation.stop();
};

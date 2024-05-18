import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBStatePlugin } from 'rxdb/plugins/state';
import { Network } from '@capacitor/network';
import { useState } from 'react';

export default function (multiInstance?: boolean) {
	const [localDbInited, setLocalDbInited] = useState(false);

	if (!R.db) {
		const { project, environment = 'd2', projectVersion, projectDefaults } = Noodl.getProjectSettings();

		if (R.states.devMode) import('rxdb/plugins/dev-mode').then((module) => addRxPlugin(module.RxDBDevModePlugin));
		addRxPlugin(RxDBLeaderElectionPlugin);
		addRxPlugin(RxDBCleanupPlugin);
		addRxPlugin(RxDBMigrationPlugin);
		addRxPlugin(RxDBStatePlugin);

		createRxDatabase({ name: `${project}-${environment}`, storage: getRxStorageDexie(), multiInstance }).then(async (db) => {
			R.db = db;

			const params = await db.addState('params');
			if (projectVersion) {
				if (!params.projectVersion) await params.set('projectVersion', () => projectVersion);
				else if (projectVersion !== params.projectVersion) {
					await params.set('projectVersion', () => projectVersion);
					window.location.reload();
				}
			}

			const defaults = projectDefaults && eval(projectDefaults)?.[0];
			if (defaults) await params.set('defaults', () => defaults);

			// network state
			const network = await db.addState('network');
			const state = await Network.getStatus();
			await network.set('connected', () => state.connected);
			await network.set('connectionType', () => state.connectionType);

			Network.addListener('networkStatusChange', async (state) => {
				await network.set('connected', () => state.connected);
				await network.set('connectionType', () => state.connectionType);
				log.info('Network state changed', state);
			});

			log.info('Local DB initialized', { network: state, params: params.get() });
			setLocalDbInited(true);
		});
	}

	return localDbInited;
}

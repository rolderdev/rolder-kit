import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBStatePlugin } from 'rxdb/plugins/state';
//import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
import { createBlob } from 'rxdb';
import { Network } from '@capacitor/network';
import { useState } from 'react';
import { sendOutputs } from '@packages/port-send';
import type { NoodlNode } from '@packages/node';
import { removeRxDatabase } from 'rxdb';

export default function (noodlNode: NoodlNode, multiInstance?: boolean) {
	const [localDbInited, setLocalDbInited] = useState(false);

	if (!R.db) {
		const { project, environment = 'd2', projectVersion, projectDefaults } = Noodl.getProjectSettings();

		//if (R.states.devMode) addRxPlugin(RxDBDevModePlugin);
		addRxPlugin(RxDBLeaderElectionPlugin);
		addRxPlugin(RxDBCleanupPlugin);
		addRxPlugin(RxDBMigrationPlugin);
		addRxPlugin(RxDBStatePlugin);
		addRxPlugin(RxDBAttachmentsPlugin);

		const localDbName = `${project}-${environment}`;

		createRxDatabase({ name: localDbName, storage: getRxStorageDexie(), multiInstance }).then(async (db) => {
			R.db = db as any;
			R.libs.rxdb = { createBlob };

			const params = await db.addState('params');
			if (projectVersion) {
				if (!params.projectVersion) await params.set('projectVersion', () => projectVersion);
				else if (projectVersion !== params.projectVersion) {
					// Удаление локальной БД при смене версии
					await removeRxDatabase(localDbName, getRxStorageDexie());
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
			sendOutputs(noodlNode, [
				{ portName: 'networkType', value: state.connectionType },
				{ portName: 'networkConnected', value: state.connected }
			]);

			Network.addListener('networkStatusChange', async (state) => {
				await network.set('connected', () => state.connected);
				await network.set('connectionType', () => state.connectionType);
				sendOutputs(noodlNode, [
					{ portName: 'networkType', value: state.connectionType },
					{ portName: 'networkConnected', value: state.connected }
				]);

				log.info('Network state changed', state);
			});

			log.info('Local DB initialized', { network: state, params: params.get() });
			setLocalDbInited(true);
		});
	}

	return localDbInited;
}

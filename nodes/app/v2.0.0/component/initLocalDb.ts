import { useState } from 'react';
import { addRxPlugin, createRxDatabase, removeRxDatabase, createBlob } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBStatePlugin } from 'rxdb/plugins/state';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
import { Network } from '@capacitor/network';
import { sendOutput } from '@shared/port-send-v1.0.0';
import type { NoodlNode } from '@shared/node-v1.0.0';

export default function (noodlNode: NoodlNode, multiInstance?: boolean) {
	const [localDbInited, setLocalDbInited] = useState(false);

	if (!R.db) {
		const { project, environment = 'd2', projectVersion, projectDefaults } = Noodl.getProjectSettings();

		addRxPlugin(RxDBLeaderElectionPlugin);
		addRxPlugin(RxDBCleanupPlugin);
		addRxPlugin(RxDBMigrationPlugin);
		addRxPlugin(RxDBStatePlugin);
		addRxPlugin(RxDBAttachmentsPlugin);

		// Зададим название локальной БД так, чтобы разработчик не получал гемор от того, что использует приложение по разным ссылкам.
		const localDbName = `${project}-${environment}-${location.hostname}`;
		createRxDatabase({ name: localDbName, storage: getRxStorageDexie(), multiInstance }).then(async (db) => {
			R.db = db;
			R.libs.rxdb = { createBlob };
			// State в RxDb такая же БД, как и коллекции. Значит могут быть конфликты, которые нет смысла разруливать.
			// Поэтому пересоздаем всю БД при 2-х сценариях - смене версии приложения и конфликте схемы State.
			let params: any;
			try {
				params = await db.addState('params'); // Здесь может быть конфликт, поэтому обернуто в try-catch
				if (projectVersion) {
					if (!params.projectVersion) await params.set('projectVersion', () => projectVersion);
					else if (projectVersion !== params.projectVersion) {
						// Удаление локальной БД при смене версии
						await removeRxDatabase(localDbName, getRxStorageDexie());
						await params.set('projectVersion', () => projectVersion);
						window.location.reload();
					}
				}
			} catch (e) {
				// Удаляем БД и перезапускаем приложение.
				await removeRxDatabase(localDbName, getRxStorageDexie());
				window.location.reload();
			}

			const defaults = projectDefaults && eval(projectDefaults)?.[0];
			if (defaults) await params.set('defaults', () => defaults);

			// network state
			const network = await db.addState('network');
			const state = await Network.getStatus();
			await network.set('connected', () => state.connected);
			await network.set('connectionType', () => state.connectionType);
			sendOutput(noodlNode, 'networkType', state.connectionType);
			sendOutput(noodlNode, 'networkConnected', state.connected);

			Network.addListener('networkStatusChange', async (state) => {
				await network.set('connected', () => state.connected);
				await network.set('connectionType', () => state.connectionType);
				sendOutput(noodlNode, 'networkType', state.connectionType);
				sendOutput(noodlNode, 'networkConnected', state.connected);

				log.info('Network state changed', state);
			});

			log.info('Local DB initialized', { network: state, params: params.get() });
			setLocalDbInited(true);
		});
	}

	return localDbInited;
}

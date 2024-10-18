import { addRxPlugin, createBlob, createRxDatabase, removeRxDatabase } from 'rxdb'
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments'
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup'
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election'
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema'
import { RxDBStatePlugin } from 'rxdb/plugins/state'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'

export default async (multiInstance?: boolean) => {
	const { project, environment = 'd2', projectVersion, projectDefaults } = Noodl.getProjectSettings()

	addRxPlugin(RxDBLeaderElectionPlugin)
	addRxPlugin(RxDBCleanupPlugin)
	addRxPlugin(RxDBMigrationPlugin)
	addRxPlugin(RxDBStatePlugin)
	addRxPlugin(RxDBAttachmentsPlugin)

	// Зададим название локальной БД так, чтобы разработчик не получал гемор от того, что использует приложение по разным ссылкам.
	const localDbName = `${project}-${environment}-${location.hostname}`
	const db = await createRxDatabase({ name: localDbName, storage: getRxStorageDexie(), multiInstance })
	R.db = db
	R.libs.rxdb = { createBlob }
	// State в RxDb такая же БД, как и коллекции. Значит могут быть конфликты, которые нет смысла разруливать.
	// Поэтому пересоздаем всю БД при 2-х сценариях - смене версии приложения и конфликте схемы State.
	let params: any
	try {
		params = await db.addState('params') // Здесь может быть конфликт, поэтому обернуто в try-catch
		if (projectVersion) {
			if (!params.projectVersion) await params.set('projectVersion', () => projectVersion)
			else if (projectVersion !== params.projectVersion) {
				// Удаление локальной БД при смене версии
				await removeRxDatabase(localDbName, getRxStorageDexie())
				await params.set('projectVersion', () => projectVersion)
				window.location.reload()
			}
		}
	} catch (e) {
		// Удаляем БД и перезапускаем приложение.
		await removeRxDatabase(localDbName, getRxStorageDexie())
		window.location.reload()
	}

	const defaults = projectDefaults && eval(projectDefaults)?.[0]
	if (defaults) await params.set('defaults', () => defaults)

	log.info('Local DB initialized', params.get())
}

import map from 'just-map-object'
import type { RxCollection } from 'rxdb'
import type { Props } from '../types'

export default async function (collectionsDefinition: Props['collectionsDefinition']) {
	const { db } = R

	if (!db) {
		R.libs.mantine?.MantineError?.('Системная ошибка!', `No db at R`)
		log.error('No db at R', R)
		return Promise.reject()
	}

	const rxDefinitions: any = {}
	map(collectionsDefinition, (name, def) => {
		rxDefinitions[name] = def.rxDefinition
	})

	// Нужно взять существующие коллекции на случай, когда они уже есть, например при сбросе авторизации без перезагрузки приложения.
	const existsCollections: { [x: string]: RxCollection<any, {}, {}, {}, any> } = {}
	Object.keys(rxDefinitions).map((i) => (existsCollections[i] = db.collections[i]))

	const collections = Object.values(existsCollections).some((i) => i) ? existsCollections : await db.addCollections(rxDefinitions)

	map(collections, (_, collection) => {
		// kuzzle will overwrite it to be one point of proof
		collection.preSave((plainData) => {
			plainData.sysinfo.updatedAt = new Date().valueOf()
		}, false)
		/* collection.postSave(function (plainData) {
			//@ts-ignore
			const postSave = collectionsDefinition[this.name].postSave;
			if (postSave) {
				//plainData = postSave(plainData);
				//plainData['task-result'] = undefined;
				//delete plainData['task-result'];
				//console.log(plainData);
			}
		}, false) */
	})

	return collections
}

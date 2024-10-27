import type { JSONObject, ResponsePayload } from '@nodes/app-v2.0.0'
import { getKuzzle } from '@shared/get-kuzzle'
import type { NoodlNode } from '@shared/node-v1.0.0'
import type { Props } from '../node/definition'
import type { BackendData } from './fetch'
import { handleSubscribe } from './handleSubscribe'
import handleDataChanges from './handleDataChanges'

export default async (p: Props, noodlNode: NoodlNode) => {
	const K = await getKuzzle()
	if (!K) return

	const { dbName } = R.env
	if (!dbName) return

	const fetchScheme = p.store.fetchScheme

	if (!fetchScheme) return

	let response: ResponsePayload<JSONObject> | undefined

	try {
		response = await K.query({
			controller: 'rolder',
			action: `fetch_${p.store.apiVersion}`,
			dbName,
			fetchScheme,
			subscribe: p.subscribe,
		})
	} catch (e: any) {
		log.error('useData fetch error.', e)
		return
	}

	const data = response?.result as BackendData

	if (data.error) log.error('Kuzzle error.', data.error)

	p.store.schemesData = data.fetchResults

	// Запустим подписку на схемы.
	if (p.subscribe) handleSubscribe(p, noodlNode)

	// Подготовим и отправим данные.
	handleDataChanges(p, noodlNode)
}

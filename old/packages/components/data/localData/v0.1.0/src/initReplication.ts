import map from 'just-map-object'
import type { RxCollectionBase, RxReplicationPullStreamItem } from 'rxdb'
import { type RxReplicationState, replicateRxCollection } from 'rxdb/plugins/replication'
import { Subject } from 'rxjs'
import type { Props } from '../types'
import pullHandler from './pullHandler'
import pushHandler from './pushHandler'

let firstTime = true

export default async function (
	composedPullsStremUrl: string,
	collections: Record<string, RxCollectionBase<any>>,
	collectionsDefinition: Props['collectionsDefinition']
) {
	const replicationStates: { [dbClass: string]: RxReplicationState<any, any> } = {}

	const pullStream$ = new Subject<RxReplicationPullStreamItem<any, any>>()
	const eventSource = new EventSource(composedPullsStremUrl)
	eventSource.onmessage = (event) => {
		const eventData = JSON.parse(event.data)

		if (Object.keys(collections).includes(eventData)) setTimeout(() => replicationStates[eventData].reSync(), 2000)
		else
			pullStream$.next({
				documents: eventData.documents,
				checkpoint: eventData.checkpoint,
			})
	}

	eventSource.onerror = () => {
		setTimeout(() => pullStream$.next('RESYNC'), 1000)
	}

	const connected = R.db?.states.network.connected$
	connected.subscribe((connected: boolean) => {
		if (connected && !firstTime) setTimeout(() => pullStream$.next('RESYNC'), 1000)
		if (firstTime) firstTime = false
	})

	map(collections, async (_, collection) => {
		const fetchScheme = collectionsDefinition[collection.name].fetchScheme

		const replicationState = replicateRxCollection({
			collection,
			replicationIdentifier: collection.name,
			pull: {
				handler: (checkpoint) => pullHandler(checkpoint, collection.name, fetchScheme),
				batchSize: 1000000,
				stream$: pullStream$.asObservable(),
			},
			push: {
				handler: (changeRows) => pushHandler(collection.name, changeRows),
			},
		})

		replicationStates[collection.name] = replicationState

		replicationState.error$.subscribe((e) => log.info('Rx replication error', e))
	})
}

import type { RxCollectionBase, RxReplicationPullStreamItem } from 'rxdb';
import { Subject } from 'rxjs';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import pullHandler from './pullHandler';
import pushHandler from './pushHandler';
import map from 'just-map-object';

export default async function (composedPullsStremUrl: string, collections: Record<string, RxCollectionBase<any>>) {
	const pullStream$ = new Subject<RxReplicationPullStreamItem<any, any>>();
	//const eventSource = new EventSource('http://localhost:8512/_/pullStream', { withCredentials: true });
	const eventSource = new EventSource(composedPullsStremUrl);
	eventSource.onmessage = (event) => {
		const eventData = JSON.parse(event.data);

		pullStream$.next({
			documents: eventData.documents,
			checkpoint: eventData.checkpoint
		});
	};
	eventSource.onerror = () => pullStream$.next('RESYNC');

	map(collections, (_, collection) => {
		const rs = replicateRxCollection({
			collection,
			replicationIdentifier: collection.name,
			pull: {
				handler: pullHandler,
				batchSize: 1000,
				stream$: pullStream$.asObservable()
			},
			push: {
				handler: pushHandler
			}
		});

		rs.error$.subscribe((err) => console.log('error$', err));
	});
}

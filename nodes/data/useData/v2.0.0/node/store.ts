import type { Item } from '@shared/types-v0.1.0';
import type { BaseProps, Props } from '../node/definition';

export default (p: Props) =>
	({
		rootId: R.libs.nanoid(8),
		inited: false,
		apiVersion: p.apiVersion,
		fetchScheme: p.fetchScheme,
		controlled: p.controlled,
		subscribe: p.subscribe,
		schemes: new Map(),
		items: new Map(),
		subscribes: new Map(),
	} satisfies Store);

export type Store = BaseProps & {
	rootId: string;
	inited: boolean;
	schemes: Map<string, SchemeData>;
	items: Map<string, Item>;
	subscribes: Subscribes;
	socket?: WebSocket;
};

type Subscribes = Map<string, string>;

export type SchemeData = {
	scheme: FetchScheme;
	parentId?: string;
	itemIds: string[];
	fetched: number;
	total: number;
	aggregations?: { [x: string]: any };
};
export type FetchScheme = { dbClass: string; filters?: {}; sorts: readonly { [path: string]: 'asc' | 'desc' }[] };

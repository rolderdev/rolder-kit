import type { HierarchyNode as Hierarchy } from 'd3-hierarchy';
import type { BaseProps, Props } from '../types';
import type { Item } from '@shared/types-v0.1.0';

export default (p: Props) => {
	const { proxy, proxyMap, ref } = R.libs.valtio;

	return proxy<Store>({
		rootId: R.libs.nanoid(6),
		inited: false,
		apiVersion: p.apiVersion,
		fetchScheme: p.fetchScheme,
		controlled: p.controlled,
		subscribe: p.subscribe,
		// Не реактивное хранилище.
		data: {
			schemes: ref(proxyMap()),
			items: ref(proxyMap()),
		},
		rootItem: {} as Item,
		itemsSelectionState: {} as ItemsSelectionState,
		subscribes: ref(proxyMap()), // Не реактивное хранилище.
	});
};

export type Store = BaseProps & {
	rootId: string;
	inited: boolean;
	subscribes: Subscribes;
	data: { schemes: Map<string, SchemeData>; items: Items };
	rootItem: Item;
	itemsSelectionState: ItemsSelectionState;
};
type Items = Map<string, Item>;
type Subscribes = Map<string, string>;

export type HierarchyNode = Omit<Hierarchy<HierarchyItem>, 'id'>;
export type HierarchyItem = {
	id: string;
	dbClass: string;
	hierarchyData: HierarchyData;
};
export type HierarchyData = Record<string, SchemeData>;

export type SchemeData = {
	scheme: ResultScheme;
	parentId: string;
	itemIds: string[];
	fetched: number;
	total: number;
	aggregations: { [x: string]: any };
};
export type ResultScheme = { dbClass: string; filters?: {}; sorts: readonly { [path: string]: 'asc' | 'desc' }[] };

type ItemsSelectionState = Record<string, ItemSelectionState>;
export type ItemSelectionState = { selection: SelectionState };
export type SelectionState = 'notSelected' | 'selected' | 'indeterminate';

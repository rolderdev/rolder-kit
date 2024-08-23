import type { HierarchyNode as Hierarchy } from 'd3-hierarchy';
import type { BaseProps, Props } from '../types';
import type { FrontItem, Item } from '@shared/types-v0.1.0';

export default (p: Props) => {
	const { proxy, proxyMap } = R.libs.valtio;

	return proxy<Store>({
		inited: false,
		apiVersion: p.apiVersion,
		fetchScheme: p.fetchScheme,
		controlled: p.controlled,
		subscribe: p.subscribe,
		schemes: proxyMap(),
		items: proxyMap(),
		rootHierarchyNode: {} as HierarchyNode,
		hierarchyItems: proxyMap(),
		subscribes: proxyMap(),
	});
};

export type Store = BaseProps & {
	inited: boolean;
	subscribes: Subscribes;
	items: Items;
	schemes: Schemes;
	rootHierarchyNode: HierarchyNode;
	hierarchyItems: HierarchyItems;
};

export type ResultScheme = { dbClass: string; filters?: {}; sorts: readonly { [path: string]: 'asc' | 'desc' }[] };

export type HierarchyNode = Hierarchy<HierarchyItem>;
export type HierarchyItem = {
	id: string;
	kid: string;
	item: FrontItem;
	state: { selection: 'selected' | 'notSelected' | 'indeterminate' };
	dbClass: string;
	hierarchyData?: HierarchyData;
	getSelected?: (params: { dbClass: string; withIndeterminate?: boolean; withParent?: boolean }) => FrontItem[];
	getDescendants?: (params: { dbClass: string; skipSelf?: boolean }) => FrontItem[];
	getAncestors?: (params: { dbClass: string; skipSelf?: boolean }) => FrontItem[];
};

type Subscribes = Map<string, string>;
type Items = Map<string, Item>;
type Schemes = Map<string, SchemeData>;
export type HierarchyData = Record<string, SchemeData>;
type HierarchyItems = Map<string, HierarchyItem>;

export type SchemeData = {
	scheme: ResultScheme;
	parentId: string;
	itemIds: string[];
	items: FrontItems;
	fetched: number;
	total: number;
	aggregations: { [x: string]: any };
};

export type FrontItems = Map<string, FrontItem>;
export type BackendSchemeData = Omit<SchemeData, 'items'>;

import { BaseJsProps } from '@shared/node-v1.0.0';
import { Item } from '@shared/types-v0.1.0';
import type { HierarchyNode } from 'd3-hierarchy';
import { FetchScheme } from './node/validtaion';

export type Props = BaseJsProps & BaseProps & { store: Store };

type BaseProps = {
	apiVersion: 'v2';
	// Весь тип схемы не нужен, т.к. она полностью передается в Kuzzle.
	fetchScheme: FetchScheme;
	controlled: boolean;
	subscribe: boolean;
};

export type Store = BaseProps & {
	useDataId: string;
	inited: boolean;
	subscribes: Subscribes;
	items: Items;
	schemes: Schemes;
	hierarchy: Hierarchy;
};

type ResultScheme = { dbClass: string; filters?: {}; sorts: { [path: string]: 'asc' | 'desc' }[] };

type Hierarchy = HierarchyNode<HierarchyItem>;
export type HierarchyItem = { id: string; item: Item; dbClass?: string; hierarchyData?: Item['hierarchyData'] };

type Subscribes = Map<string, string>;
type Items = Map<string, Item>;
type Schemes = Map<string, SchemeData>;

export type SchemeData = {
	scheme: ResultScheme;
	parentId: string;
	items: Item[];
	fetched: number;
	total: number;
	aggregations: { [x: string]: any };
	error?: string;
};

import { BaseJsProps } from '@shared/node-v1.0.0';
import type { FetchScheme } from './node/validtaion';
import type { Store, HierarchyNode, HierarchyItem } from './node/store';
import type { ItemFunctions } from './component/addItemFunctions';
import type { SelectionState, ItemSelectionState } from './node/store';

export type Props = BaseJsProps & BaseProps & { store: Store };

export type BaseProps = {
	apiVersion: 'v2';
	// Весь тип схемы не нужен, т.к. она полностью передается в Kuzzle.
	fetchScheme: FetchScheme;
	outputDbClasses?: string[];
	controlled: boolean;
	subscribe: boolean;
};

export type { ItemFunctions, SelectionState, ItemSelectionState };

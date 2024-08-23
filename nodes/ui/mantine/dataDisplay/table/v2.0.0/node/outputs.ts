import { getPortDef, type PortDef } from '@shared/port-v1.0.0';
import type { Props } from '../types';

export default [
	// Base
	getPortDef({
		name: 'level',
		displayName: 'Level',
		group: 'Custom',
		customGroup: 'Base',
		type: 'number',
	}),
	getPortDef({
		name: 'clickedItem',
		displayName: 'Clicked item',
		group: 'Custom',
		customGroup: 'Base',
		type: 'object',
		dependsOn: (p) => p.onRowClick === 'signal',
	}),
	getPortDef({
		name: 'clickedHierarchyNode',
		displayName: 'Clicked hierarchy node',
		group: 'Custom',
		customGroup: 'Base',
		type: 'object',
		dependsOn: (p: Props) => p.onRowClick === 'signal' && (p.useExpansionHierarchy === true || p.useSelectionHierarchy === true),
	}),
	getPortDef({
		name: 'rowClicked',
		displayName: 'Row clicked',
		group: 'Custom',
		customGroup: 'Base',
		type: 'signal',
		dependsOn: (p) => p.onRowClick === 'signal',
	}),
	// Single selection
	getPortDef({
		name: 'selectedItem',
		displayName: 'Selected item',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'object',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
	}),
	getPortDef({
		name: 'selectedHierarchyNode',
		displayName: 'Selected hierarchy node',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'object',
		dependsOn: (p: Props) =>
			p.onRowClick === 'singleSelection' && (p.useExpansionHierarchy === true || p.useSelectionHierarchy === true),
	}),
	getPortDef({
		name: 'selectedItemChanged',
		displayName: 'Selected item changed',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'signal',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
	}),
	// Multi selection
	getPortDef({
		name: 'selectedItems',
		displayName: 'Selected items',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'array',
		dependsOn: (p: Props) => p.multiSelection,
	}),
	getPortDef({
		name: 'selectedItemsChanged',
		displayName: 'Selected items changed',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'signal',
		dependsOn: (p: Props) => p.multiSelection,
	}),
	// Expansion
	getPortDef({
		name: 'expandedItems',
		displayName: 'Expanded items',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'array',
		dependsOn: (p: Props) => p.expansion,
	}),
	getPortDef({
		name: 'expandedItemsChanged',
		displayName: 'Expanded items changed',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'signal',
		dependsOn: (p: Props) => p.expansion,
	}),
] as PortDef[];

// 	// Sort
// 	getPortDef({
//
// 		name: 'sortState',
// 		group: 'Sort',
// 		type: 'object',
// 		displayName: 'Sort state',
// 		customs: {
// 			dependsOn(p) {
// 				return p.sort ? true : false;
// 			},
// 		},
// 	}),
// 	getPortDef({
//
// 		name: 'sortStateChanged',
// 		group: 'Sort',
// 		type: 'signal',
// 		displayName: 'Sort state changed',
// 		customs: {
// 			dependsOn(p) {
// 				return p.sort ? true : false;
// 			},
// 		},
// 	}),
// ]

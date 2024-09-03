import { getPortDef, sizes, type PortDef } from '@shared/port-v1.0.0';
import { validateColumns, validateExpandedItems, validateItems } from './validtaion';
import type { Props } from '../types';
// Enablers
/*    
    "table2FilterEnabled",            
    // Filter
    "table2FilterType",
    "table2ResetFilters",
    */

export default [
	// Base
	getPortDef({
		name: 'columnsDefinition',
		displayName: 'Columns',
		group: 'Custom',
		customGroup: 'Base',
		type: 'array',
		default: `/*[
	{
		title: 'ЖК > Объект',
		type: 'accessor',
		accessor: 'content.name',
	},
	{
		title: 'Количество зон',
		type: 'getValue',
		getValue: (item, items) => item.content.houseCount * item.content.areaCount,
		width: 120
	}	
]*/
`,
		validate: (p: Props) => (p.columnsDefinition?.length ? validateColumns(p) : false),
	}),
	getPortDef({
		name: 'items',
		displayName: 'Items',
		group: 'Custom',
		customGroup: 'Base',
		type: 'array',
		// Только через подключение, иначе нельзя сделать хорошую реактивность, т.к. массив в редакторе это текст, а не js-код.
		visibleAt: 'connection',
		validate: (p: Props) => (p.items?.length ? validateItems(p) : true),
	}),
	getPortDef({
		name: 'onRowClick',
		displayName: 'On row click',
		group: 'Custom',
		customGroup: 'Base',
		type: [
			{ label: 'Disabled', value: 'disabled' },
			{ label: 'Signal', value: 'signal' },
			{ label: 'Single selection', value: 'singleSelection' },
		],
		default: 'disabled',
		validate: (p: Props) => (p.onRowClick ? true : false),
		transform: (p: Props, portDef) =>
			p.expansion ? { ...portDef, type: [...(portDef.type as any), { label: 'Expansion', value: 'expansion' }] } : portDef,
	}),
	getPortDef({
		name: 'clickFilterFunc',
		displayName: 'Click filter func',
		group: 'Custom',
		customGroup: 'Base',
		type: 'funcEval',
		dependsOn: (p: Props) => p.onRowClick === 'signal',
		codeComment: `//(item) => item.states.flow !== 'closed'`,
	}),
	getPortDef({
		name: 'singleSelectionFilterFunc',
		displayName: 'Single selection filter func',
		group: 'Custom',
		customGroup: 'Base',
		type: 'funcEval',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
		codeComment: `//(item) => item.states.flow !== 'closed'`,
	}),
	getPortDef({
		name: 'textSelectionDisabled',
		displayName: 'Disable text selection',
		group: 'Custom',
		customGroup: 'Base',
		type: 'boolean',
		default: false,
	}),
	// Layout
	getPortDef({
		name: 'noHeader',
		displayName: 'No header',
		group: 'Layout',
		type: 'boolean',
		default: false,
	}),
	// Dimensions
	getPortDef({
		name: 'dimensions',
		displayName: 'Enabled',
		group: 'Dimensions',
		type: 'boolean',
		default: false,
	}),
	getPortDef({
		name: 'minHeight',
		displayName: 'Min height',
		group: 'Dimensions',
		type: 'string',
		default: '84px',
		dependsOn: (p) => p.dimensions,
	}),
	getPortDef({
		name: 'horizontalSpacing',
		displayName: 'Horizontal spacing',
		group: 'Dimensions',
		type: sizes,
		default: 'sm',
		dependsOn: (p) => p.dimensions,
	}),
	getPortDef({
		name: 'verticalSpacing',
		displayName: 'Vertical spacing',
		group: 'Dimensions',
		type: sizes,
		default: 'xs',
		dependsOn: (p) => p.dimensions,
	}),
	getPortDef({
		name: 'fz',
		displayName: 'Font size',
		group: 'Dimensions',
		type: sizes,
		default: 'sm',
		dependsOn: (p) => p.dimensions,
	}),
	// Table styles
	getPortDef({
		name: 'tableStyles',
		displayName: 'Enabled',
		group: 'Custom',
		customGroup: 'Table styles',
		type: 'boolean',
		default: false,
	}),
	getPortDef({
		name: 'shadow',
		displayName: 'Shadow',
		group: 'Custom',
		customGroup: 'Table styles',
		type: [{ value: 'none', label: 'none' }, ...sizes],
		default: 'sm',
		dependsOn: (p) => p.tableStyles,
	}),
	getPortDef({
		name: 'withTableBorder',
		displayName: 'Table border',
		group: 'Custom',
		customGroup: 'Table styles',
		type: 'boolean',
		default: false,
		dependsOn: (p) => p.tableStyles,
	}),
	getPortDef({
		name: 'borderRadius',
		displayName: 'Border radius',
		group: 'Custom',
		customGroup: 'Table styles',
		type: sizes,
		default: 'md',
		dependsOn: (p) => p.tableStyles,
	}),
	getPortDef({
		name: 'withColumnBorders',
		displayName: 'Column borders',
		group: 'Custom',
		customGroup: 'Table styles',
		type: 'boolean',
		default: false,
		dependsOn: (p) => p.tableStyles,
	}),
	getPortDef({
		name: 'loaderColor',
		displayName: 'Loader color',
		group: 'Custom',
		customGroup: 'Table styles',
		type: 'string',
		default: 'blue',
		dependsOn: (p) => p.tableStyles,
	}),
	// Row styles
	getPortDef({
		name: 'rowStyles',
		displayName: 'Enabled',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'boolean',
		default: false,
	}),
	getPortDef({
		name: 'withRowBorders',
		displayName: 'Row borders',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'boolean',
		default: true,
		dependsOn: (p: Props) => p.rowStyles,
	}),
	getPortDef({
		name: 'striped',
		displayName: 'Striped',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'boolean',
		default: false,
		dependsOn: (p: Props) => p.rowStyles,
	}),
	getPortDef({
		name: 'rowBackgroundColor',
		displayName: 'Row bg color',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'string',
		default: 'white',
		dependsOn: (p) => p.rowStyles && !p.striped,
	}),
	getPortDef({
		name: 'stripedColor',
		displayName: 'Striped bg color',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'string',
		default: 'gray.0',
		dependsOn: (p) => p.rowStyles && p.striped,
	}),
	getPortDef({
		name: 'highlightOnHover',
		displayName: 'Highlight on hover',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'boolean',
		default: false,
		dependsOn: (p: Props) => p.rowStyles,
	}),
	getPortDef({
		name: 'highlightOnHoverColor',
		displayName: 'On hover bg color',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'string',
		default: 'gray.1',
		dependsOn: (p) => p.rowStyles && p.highlightOnHover,
	}),
	getPortDef({
		name: 'singleSelectionRowBgColor',
		displayName: 'Single selection bg color',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'string',
		default: 'white', // дефолтно, предлагаем не выделять строку цветом
		dependsOn: (p: Props) => p.rowStyles && p.onRowClick === 'singleSelection',
	}),
	getPortDef({
		name: 'mutliSelectionRowBgColor',
		displayName: 'Mutli selection bg color',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'string',
		default: 'white', // дефолтно, предлагаем не выделять строку цветом
		dependsOn: (p: Props) => p.rowStyles && p.multiSelection,
	}),
	getPortDef({
		name: 'paddingLeftFunc',
		displayName: 'Left padding func',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'funcEval',
		dependsOn: (p: Props) => p.rowStyles,
		codeComment: `//(level, item) => level * 16`,
	}),
	// Single selection
	getPortDef({
		name: 'defaultSelectedItem',
		displayName: 'Default selected item',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'object',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
	}),
	getPortDef({
		name: 'selectedItem',
		displayName: 'Selected item',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'object',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
	}),
	getPortDef({
		name: 'setSelectedItem',
		displayName: 'Set selected item',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'signal',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
	}),
	getPortDef({
		name: 'resetSelectedItem',
		displayName: 'Reset selected item',
		group: 'Custom',
		customGroup: 'Single selection',
		type: 'signal',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
	}),
	// Multi selection
	getPortDef({
		name: 'multiSelection',
		displayName: 'Enabled',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'boolean',
		default: false,
	}),
	getPortDef({
		name: 'multiSelectionFilterFunc',
		displayName: 'Filter func',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'funcEval',
		dependsOn: (p: Props) => p.multiSelection,
		codeComment: `//(item) => item.states.flow !== 'closed'`,
	}),
	getPortDef({
		name: 'useSelectionHierarchy',
		displayName: 'Use hierarchy',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'boolean',
		default: false,
		dependsOn: (p: Props) => p.multiSelection,
	}),
	getPortDef({
		name: 'defaultSelectedItems',
		displayName: 'Default selected items',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'array',
		visibleAt: 'connection',
		dependsOn: (p: Props) => p.multiSelection,
	}),
	getPortDef({
		name: 'selectedItems',
		displayName: 'Selected items',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'array',
		visibleAt: 'connection',
		dependsOn: (p: Props) => p.multiSelection,
	}),
	getPortDef({
		name: 'setSelectedItems',
		displayName: 'Set selected items',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'signal',
		dependsOn: (p: Props) => p.multiSelection,
	}),
	getPortDef({
		name: 'resetSelectedItems',
		displayName: 'Reset selected items',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'signal',
		dependsOn: (p: Props) => p.multiSelection,
	}),
	// Expansion
	getPortDef({
		name: 'expansion',
		displayName: 'Enabled',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'boolean',
		default: false,
	}),
	getPortDef({
		name: 'expansionTemplate',
		displayName: 'Template',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'component',
		dependsOn: (p: Props) => p.expansion,
		validate: (p: Props) => (p.expansion ? (p.expansionTemplate ? true : false) : true),
	}),
	getPortDef({
		name: 'useExpansionHierarchy',
		displayName: 'Use hierarchy',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'boolean',
		default: false,
		dependsOn: (p: Props) => p.expansion,
	}),
	getPortDef({
		name: 'allowMultiple',
		displayName: 'Allow multiple',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'boolean',
		default: false,
		dependsOn: (p: Props) => p.expansion,
	}),
	getPortDef({
		name: 'expansionFilterFunc',
		displayName: 'Filter func',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'funcEval',
		dependsOn: (p: Props) => p.expansion,
		codeComment: `//(item) => item.states.flow !== 'closed'`,
	}),
	getPortDef({
		name: 'animationChildrenCount',
		displayName: 'Animation children count',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'number',
		default: 25,
		tooltip: 'Enable animation loader on expansion when row children count is reached.',
		dependsOn: (p: Props) => p.useExpansionHierarchy === true,
	}),
	getPortDef({
		name: 'defaultExpandedItems',
		displayName: 'Default expanded items',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'array',
		visibleAt: 'connection',
		dependsOn: (p: Props) => p.expansion,
		validate: (p: Props) => validateExpandedItems(p.defaultExpandedItems, p.allowMultiple),
	}),
	getPortDef({
		name: 'expandedItems',
		displayName: 'Expanded items',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'array',
		visibleAt: 'connection',
		dependsOn: (p: Props) => p.expansion,
		validate: (p: Props) => validateExpandedItems(p.expandedItems, p.allowMultiple),
	}),
	getPortDef({
		name: 'setExpandedItems',
		displayName: 'Set expanded items',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'signal',
		dependsOn: (p: Props) => p.expansion,
	}),
	getPortDef({
		name: 'expandAll',
		displayName: 'Expand all',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'signal',
		dependsOn: (p: Props) => p.expansion && p.allowMultiple === true,
	}),
	getPortDef({
		name: 'collapseAll',
		displayName: 'Collapse all',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'signal',
		dependsOn: (p: Props) => p.expansion && p.allowMultiple === true,
	}),
] as PortDef[];

// 	getPort({
//
// 		name: 'scopeDbClass',
// 		group: 'Scope',
// 		type: 'string',
// 		displayName: 'DB class',
// 		customs: {
// 			required: 'connection',
// 			dependsOn(p) {
// 				return p.scope ? true : false;
// 			},
// 		},
// 	}),

// 	// Sort
// 	getPort({
//
// 		name: 'sort',
// 		group: 'Sort',
// 		type: 'boolean',
// 		displayName: 'Enabled',
// 		default: false,
// 	}),
// 	getPort({
//
// 		name: 'sortType',
// 		group: 'Sort',
// 		displayName: 'Type',
// 		type: getCustomEnumType(['frontend', 'backend']),
// 		default: 'frontend',
// 		customs: {
// 			dependsOn(p) {
// 				return p.sort ? true : false;
// 			},
// 		},
// 	}),
// 	getPort({
//
// 		name: 'sortedIcon',
// 		group: 'Sort',
// 		type: 'string',
// 		displayName: 'Sorted icon',
// 		default: 'IconArrowUp',
// 		customs: {
// 			required: 'both',
// 			dependsOn(p) {
// 				return p.sort ? true : false;
// 			},
// 		},
// 	}),
// 	getPort({
//
// 		name: 'unsortedIcon',
// 		group: 'Sort',
// 		type: 'string',
// 		displayName: 'Unsorted icon',
// 		default: 'IconSelector',
// 		customs: {
// 			required: 'both',
// 			dependsOn(p) {
// 				return p.sort ? true : false;
// 			},
// 		},
// 	}),
// 	getPort({
//
// 		name: 'resetSort',
// 		group: 'Sort',
// 		type: 'signal',
// 		displayName: 'Reset sort',
// 		customs: {
// 			dependsOn(p) {
// 				return p.sort ? true : false;
// 			},
// 		},
// 	}),
// 	getPort({
//
// 		name: 'restoreDefaultSort',
// 		group: 'Sort',
// 		type: 'signal',
// 		displayName: 'Restore default',
// 		customs: {
// 			dependsOn(p) {
// 				return p.sort ? true : false;
// 			},
// 		},
// 	}),
// ],
import { type PortDef, getPortDef, sizes } from '@shared/port-v1.0.0'
import type { Props } from './definition'
import { validateColumns, validateExpandedItems, validateItems } from './validtaion'

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
		getValue: (item, items, node) => item.content.houseCount * item.content.areaCount,
		width: 120
	}
]*/
`,
		validate: (p: Props) => (p.columnsDefinition ? validateColumns(p) : true),
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
		name: 'fetching',
		displayName: 'Fetching',
		group: 'Custom',
		customGroup: 'Base',
		type: 'boolean',
		default: true,
	}),
	getPortDef({
		name: 'hierarchy',
		displayName: 'Enable hierarchy',
		group: 'Custom',
		customGroup: 'Base',
		type: 'boolean',
		default: false,
	}),
	getPortDef({
		name: 'rootNodeId',
		displayName: 'Root node id',
		group: 'Custom',
		customGroup: 'Base',
		type: 'string',
		visibleAt: 'connection',
		dependsOn: (p: Props) => p.hierarchy,
	}),
	getPortDef({
		name: 'textSelectionDisabled',
		displayName: 'Disable text selection',
		group: 'Custom',
		customGroup: 'Base',
		type: 'boolean',
		default: false,
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
		validate: (p: Props) => !!p.onRowClick,
		transform: (_p: Props, portDef) => {
			portDef.type = [...(portDef.type as any), { label: 'Expansion', value: 'expansion' }]
		},
	}),
	getPortDef({
		name: 'clickFilterFunc',
		displayName: 'Click filter func',
		group: 'Custom',
		customGroup: 'Base',
		type: 'funcEval',
		dependsOn: (p: Props) => p.onRowClick === 'signal',
		codeComment: '//(item, node) => { return Boolean(node?.childIds) }',
	}),
	getPortDef({
		name: 'singleSelectionFilterFunc',
		displayName: 'Single selection filter func',
		group: 'Custom',
		customGroup: 'Base',
		type: 'funcEval',
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection',
		codeComment: `//(item, node) => { return item.states.flow !== 'closed' }`,
	}),
	getPortDef({
		name: 'useSingleSelectionHierarchy',
		displayName: 'Use single selection hierarchy',
		group: 'Custom',
		customGroup: 'Base',
		type: 'boolean',
		default: false,
		dependsOn: (p: Props) => p.onRowClick === 'singleSelection' && p.hierarchy,
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
		type: [{ value: 'xxs', label: 'xxs' }, ...sizes],
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
		dependsOn: (p: Props) => p.rowStyles && !p.hierarchy,
	}),
	getPortDef({
		name: 'rowBackgroundColor',
		displayName: 'Row bg color',
		group: 'Custom',
		customGroup: 'Row styles',
		type: 'string',
		default: 'white',
		dependsOn: (p) => p.rowStyles,
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
		codeComment: '//(level, item) => { return level * 16 }',
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
		codeComment: `//(item, node) => { return item.states.flow !== 'closed' }`,
	}),
	getPortDef({
		name: 'useMultiSelectionHierarchy',
		displayName: 'Use hierarchy',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'boolean',
		default: false,
		dependsOn: (p: Props) => p.multiSelection && p.hierarchy,
	}),
	getPortDef({
		name: 'multiSelectionClasses',
		displayName: 'Classes',
		group: 'Custom',
		customGroup: 'Multi selection',
		type: 'array',
		dependsOn: (p: Props) => p.multiSelection && p.hierarchy,
		codeComment: `//['first-class', 'second-class']`,
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
		validate: (p: Props) => (p.expansion ? !!p.expansionTemplate : true),
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
		codeComment: `//(item, node) => { return item.states.flow !== 'closed' }`,
	}),
	getPortDef({
		name: 'useExpansionHierarchy',
		displayName: 'Use hierarchy',
		group: 'Custom',
		customGroup: 'Expansion',
		type: 'boolean',
		default: false,
		dependsOn: (p: Props) => p.expansion && p.hierarchy,
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
	// Sort
	getPortDef({
		name: 'sort',
		displayName: 'Enabled',
		group: 'Custom',
		customGroup: 'Sort',
		type: 'boolean',
		default: false,
	}),
	getPortDef({
		name: 'sortType',
		displayName: 'Type',
		group: 'Custom',
		customGroup: 'Sort',
		type: [
			{ label: 'Frontend', value: 'frontend' },
			{ label: 'Backend', value: 'backend' },
		],
		default: 'frontend',
		dependsOn: (p: Props) => p.sort,
	}),
	getPortDef({
		name: 'sortedIcon',
		displayName: 'Sorted icon',
		group: 'Custom',
		customGroup: 'Sort',
		type: 'string',
		default: 'IconArrowUp',
		dependsOn: (p: Props) => p.sort,
		validate: (p: Props) => (p.sort ? !!p.sortedIcon : true),
	}),
	getPortDef({
		name: 'unsortedIcon',
		displayName: 'Unsorted icon',
		group: 'Custom',
		customGroup: 'Sort',
		type: 'string',
		default: 'IconSelector',
		dependsOn: (p: Props) => p.sort,
		validate: (p: Props) => (p.sort ? !!p.unsortedIcon : true),
	}),
	getPortDef({
		name: 'resetSort',
		displayName: 'Reset sort',
		group: 'Custom',
		customGroup: 'Sort',
		type: 'signal',
		dependsOn: (p: Props) => p.sort,
	}),
	getPortDef({
		name: 'restoreDefaultSort',
		displayName: 'Restore default',
		group: 'Custom',
		customGroup: 'Sort',
		type: 'signal',
		dependsOn: (p: Props) => p.sort,
	}),
] as PortDef[]

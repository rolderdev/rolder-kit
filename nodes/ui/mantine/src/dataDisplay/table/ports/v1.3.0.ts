import { defaultUnits, enums, getCustomEnumType, getEnumType, getPort, getPorts, getType } from '@packages/port';

const inputs130 = [
	...getPorts('input', [
		'customProps',
		'propsFunction'
		// Enablers
		/*  "table2SingleSelection",
    "table2MultiSelection",
    "table2Sort",
    "table2FilterEnabled",    
    "table2Layout",
    
    
    // Params*/

		//"table2TextSelection",

		/*// Single selection
    "table2SingleSelectedItem",
    "table2Unselectable",
    "table2ResetSingleSelection",
    // Multi selection
    "table2MultiSelectedItems",
    "table2ResetMultiSelection",
    // Sort
    "table2SortType",
    "table2SortedIcon",
    "table2UnsortedIcon",
    "table2ResetSort",
    // Filter
    "table2FilterType",
    "table2ResetFilters",
    // Expansion
    "table2ExpandedItems",

    "table2ExpandAll",
    "table2UnexpandAll",
    // Layout
    "table2NoHeader", */
	]),
	// Base
	getPort({
		plug: 'input',
		name: 'columnsDefinition',
		group: 'Base',
		type: 'array',
		displayName: 'Columns',
		default: `/*[
	{
		title: 'ЖК > Объект',
		accessor: 'content.name'
	},
	{
		title: 'Объектов',
		accessor: 'housesCount',
		width: 120
	},
	{
		title: 'Зон',
		accessor: 'areasCount',
		width: 120
	}
]*/
`
	}),
	getPort({
		plug: 'input',
		name: 'items',
		group: 'Base',
		type: 'array',
		displayName: 'Items'
	}),
	getPort({
		plug: 'input',
		name: 'onRowClick',
		group: 'Base',
		displayName: 'On row click',
		type: getCustomEnumType(['disabled', 'singleSelection', 'expansion']),
		default: 'disabled',
		customs: {
			dependsOn(p) {
				return p.expansion ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'onRowClick',
		group: 'Base',
		displayName: 'On row click',
		type: getCustomEnumType(['disabled', 'singleSelection']),
		default: 'disabled',
		customs: {
			dependsOn(p) {
				return p.expansion ? false : true;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'onRowClickFunc',
		group: 'Base',
		displayName: 'On row click function',
		type: 'array',
		customs: {
			isObject: true,
			dependsOn(p) {
				return p.expansion ? true : false;
			}
		}
	}),
	// States
	getPort({
		plug: 'input',
		name: 'fetching',
		group: 'States',
		type: 'boolean',
		displayName: 'Fetching',
		default: true
	}),
	// Layout
	getPort({
		plug: 'input',
		name: 'layout',
		group: 'Layout',
		type: getType('boolean', 'editor'),
		displayName: 'Enabled',
		default: false
	}),
	getPort({
		plug: 'input',
		name: 'noHeader',
		group: 'Layout',
		type: 'boolean',
		displayName: 'No header',
		default: false,
		customs: {
			dependsOn(p) {
				return p.layout ? true : false;
			}
		}
	}),
	// Dimensions
	getPort({
		plug: 'input',
		name: 'dimensions',
		group: 'Dimensions',
		type: getType('boolean', 'editor'),
		displayName: 'Enabled',
		default: false
	}),
	getPort({
		plug: 'input',
		name: 'minHeight',
		group: 'Dimensions',
		type: 'string',
		default: '84px',
		displayName: 'Min height',
		customs: {
			dependsOn(p) {
				return p.dimensions ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'maxHeight',
		group: 'Dimensions',
		type: 'string',
		displayName: 'Max height',
		default: 'calc(100% - 0px)',
		customs: {
			dependsOn(p) {
				return p.dimensions ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'horizontalSpacing',
		group: 'Dimensions',
		type: getEnumType(enums.sizes),
		displayName: 'Horizontal spacing',
		default: 'sm',
		customs: {
			dependsOn(p) {
				return p.dimensions ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'verticalSpacing',
		group: 'Dimensions',
		type: getEnumType(enums.sizes),
		displayName: 'Vertical spacing',
		default: 'xs',
		customs: {
			dependsOn(p) {
				return p.dimensions ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'fz',
		group: 'Dimensions',
		type: getEnumType(enums.sizes),
		displayName: 'Font size',
		default: 'sm',
		customs: {
			dependsOn(p) {
				return p.dimensions ? true : false;
			}
		}
	}),
	// Table styles
	getPort({
		plug: 'input',
		name: 'tableStyles',
		group: 'Table styles',
		type: getType('boolean', 'editor'),
		displayName: 'Enabled',
		default: false
	}),
	getPort({
		plug: 'input',
		name: 'shadow',
		group: 'Table styles',
		type: getEnumType(enums.sizes),
		displayName: 'Shadow',
		default: 'sm',
		customs: {
			dependsOn(p) {
				return p.tableStyles ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'withTableBorder',
		group: 'Table styles',
		type: 'boolean',
		displayName: 'Table border',
		default: false,
		customs: {
			dependsOn(p) {
				return p.tableStyles ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'borderRadius',
		group: 'Table styles',
		type: getEnumType(enums.sizes),
		displayName: 'Border radius',
		default: 'md',
		customs: {
			dependsOn(p) {
				return p.tableStyles ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'withColumnBorders',
		group: 'Table styles',
		type: 'boolean',
		displayName: 'Column borders',
		default: false,
		customs: {
			dependsOn(p) {
				return p.tableStyles ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'loaderColor',
		group: 'Table styles',
		type: 'string',
		displayName: 'Loader color',
		default: 'blue',
		customs: {
			dependsOn(p) {
				return p.tableStyles ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'animation',
		group: 'Table styles',
		type: 'boolean',
		displayName: 'Animation',
		default: true,
		customs: {
			dependsOn(p) {
				return p.tableStyles && !p.expansion;
			}
		}
	}),
	// Row styles
	getPort({
		plug: 'input',
		name: 'rowStyles',
		group: 'Row styles',
		type: getType('boolean', 'editor'),
		displayName: 'Enabled',
		default: false
	}),
	getPort({
		plug: 'input',
		name: 'withRowBorders',
		group: 'Row styles',
		type: getType('boolean', 'editor'),
		displayName: 'Row borders',
		default: true,
		customs: {
			dependsOn(p) {
				return p.rowStyles ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'striped',
		group: 'Row styles',
		type: getType('boolean', 'editor'),
		displayName: 'Striped',
		default: false,
		customs: {
			dependsOn(p) {
				return p.rowStyles ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'rowBackgroundColor',
		group: 'Row styles',
		type: 'string',
		default: 'white',
		displayName: 'Row bg color',
		customs: {
			dependsOn(p) {
				return p.rowStyles && !p.striped;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'stripedColor',
		group: 'Row styles',
		type: 'string',
		default: 'gray.0',
		displayName: 'Striped bg color',
		customs: {
			dependsOn(p) {
				return p.rowStyles && p.striped;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'highlightOnHover',
		group: 'Row styles',
		type: getType('boolean', 'editor'),
		displayName: 'Highlight on hover',
		default: false,
		customs: {
			dependsOn(p) {
				return p.rowStyles ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'highlightOnHoverColor',
		group: 'Row styles',
		type: 'string',
		default: 'gray.1',
		displayName: 'On hover bg color',
		customs: {
			dependsOn(p) {
				return p.rowStyles && p.highlightOnHover;
			}
		}
	}),
	// Expansion
	getPort({
		plug: 'input',
		name: 'expansion',
		group: 'Expansion',
		type: getType('boolean', 'editor'),
		displayName: 'Enabled',
		default: false
	}),
	getPort({
		plug: 'input',
		name: 'expansionTemplate',
		displayName: 'Template',
		group: 'Expansion',
		type: 'component',
		customs: {
			required: 'both',
			dependsOn(p) {
				return p.expansion ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'allowMultiple',
		displayName: 'Allow multiple',
		group: 'Expansion',
		type: 'boolean',
		default: false,
		customs: {
			dependsOn(p) {
				return p.expansion ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'expandedItems',
		group: 'Expansion',
		type: 'array',
		displayName: 'Expanded items',
		customs: {
			dependsOn(p) {
				return p.expansion ? true : false;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'expandAll',
		group: 'Expansion',
		type: 'signal',
		displayName: 'Expand all',
		customs: {
			dependsOn(p) {
				return p.expansion && p.allowMultiple;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'unexpandAll',
		group: 'Expansion',
		type: 'signal',
		displayName: 'Unexpand all',
		customs: {
			dependsOn(p) {
				return p.expansion && p.allowMultiple;
			}
		}
	}),
	getPort({
		plug: 'input',
		name: 'expansionChanged',
		group: 'Expansion',
		type: 'signal',
		displayName: 'Expansion changed',
		customs: {
			dependsOn(p) {
				return p.expansion ? true : false;
			}
		}
	})
];

const outputs130 = [
	// Single selection
	/* 	'table2SingleSelectedItem',
	'table2SingleSelected',
	'table2SingleUnselected',
	// Multi selection
	'table2MultiSelectedItems',
	'table2MultiSelectionChanged',
	// Sort
	'table2SortValue',*/

	// Expansion
	getPort({
		plug: 'output',
		name: 'expandedItems',
		group: 'Expansion',
		type: 'array',
		displayName: 'Expanded items',
		customs: {
			dependsOn(p) {
				return p.expansion ? true : false;
			}
		}
	}),
	getPort({
		plug: 'output',
		name: 'expansionChanged',
		group: 'Expansion',
		type: 'signal',
		displayName: 'Expansion changed',
		customs: {
			dependsOn(p) {
				return p.expansion ? true : false;
			}
		}
	})
	/*
	// Table Id and parentTableId
	'tableId',
	'parentTableId' */
];

export { inputs130, outputs130 };

import { enums, getCustomEnumType, getEnumType, getPort, getPorts, getType } from '@packages/port';

export default {
	inputs: [
		...getPorts('input', [
			'customProps',
			'propsFunction',
			// Enablers
			/*    
    "table2FilterEnabled",        
    
    // Params*/

			//"table2TextSelection",

			/*
        
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
		type: 'accessor',
		accessor: 'content.name',
	},
	{
		title: 'Количество зон',
		type: 'getValue',
		getValue: (item, items, hierarchyNode) => item.content.houseCount * item.content.areaCount,
		width: 120
	}	
]*/
`,
			customs: {
				validate(p) {
					if (p.columnsDefinition) {
						const noTypeErrorColumn = p.columnsDefinition?.find((i: any) => !i.type);
						if (noTypeErrorColumn) return `Column must have the type. </br>Column: ${JSON.stringify(noTypeErrorColumn)}`;
						const typeErrorColumn = p.columnsDefinition?.find((i: any) => !i[i.type]);
						if (typeErrorColumn)
							return `Column type "${typeErrorColumn.type}" must have  "${
								typeErrorColumn.type
							}" field. </br>Column: ${JSON.stringify(typeErrorColumn)}`;
						const noSortAccessorErrorColumn = p.columnsDefinition?.find((i: any) => i.sort && !i.accessor);
						if (p.sortType === 'frontend' && noSortAccessorErrorColumn)
							return `Column must have accessor. </br>Column: ${JSON.stringify(noSortAccessorErrorColumn)}`;
					}
					return true;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'items',
			group: 'Base',
			// Только через подключение, иначе нельзя сделать хорошую реактивность, т.к. массив в редакторе это текст, а не js-код.
			type: getType('array', 'connection'),
			displayName: 'Items',
		}),
		getPort({
			plug: 'input',
			name: 'onRowClick',
			group: 'Base',
			displayName: 'On row click',
			type: getCustomEnumType(['disabled', 'signal', 'singleSelection']),
			default: 'disabled',
			customs: {
				dependsOn(p) {
					return !p.expansion;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'onRowClick',
			group: 'Base',
			displayName: 'On row click',
			type: getCustomEnumType(['disabled', 'signal', 'singleSelection', 'expansion']),
			default: 'disabled',
			customs: {
				dependsOn(p) {
					return p.expansion;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'clickFilterFunc',
			group: 'Base',
			type: 'array',
			displayName: 'Click filter func',
			customs: {
				isObject: true,
				dependsOn(p) {
					return p.onRowClick === 'signal';
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'singleSelectionFilterFunc',
			group: 'Base',
			type: 'array',
			displayName: 'Single selection filter func',
			customs: {
				isObject: true,
				dependsOn(p) {
					return p.onRowClick === 'singleSelection';
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'textSelectionDisabled',
			group: 'Base',
			type: 'boolean',
			displayName: 'Disable text selection',
			default: false,
		}),
		// Scope
		getPort({
			plug: 'input',
			name: 'scope',
			group: 'Scope',
			type: 'boolean',
			displayName: 'Enabled',
			default: false,
		}),
		getPort({
			plug: 'input',
			name: 'scopeDbClass',
			group: 'Scope',
			type: 'string',
			displayName: 'DB class',
			customs: {
				required: 'connection',
				dependsOn(p) {
					return p.scope ? true : false;
				},
			},
		}),
		// Layout
		getPort({
			plug: 'input',
			name: 'layout',
			group: 'Layout',
			type: 'boolean',
			displayName: 'Enabled',
			default: false,
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
				},
			},
		}),
		// Dimensions
		getPort({
			plug: 'input',
			name: 'dimensions',
			group: 'Dimensions',
			type: 'boolean',
			displayName: 'Enabled',
			default: false,
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
				},
			},
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
				},
			},
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
				},
			},
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
				},
			},
		}),
		// Table styles
		getPort({
			plug: 'input',
			name: 'tableStyles',
			group: 'Table styles',
			type: 'boolean',
			displayName: 'Enabled',
			default: false,
		}),
		getPort({
			plug: 'input',
			name: 'shadow',
			group: 'Table styles',
			type: getEnumType([{ value: 'none', label: 'none' }, ...enums.sizes]),
			displayName: 'Shadow',
			default: 'sm',
			customs: {
				dependsOn(p) {
					return p.tableStyles && !p.isParentTable;
				},
			},
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
				},
			},
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
					return p.tableStyles && !p.isParentTable;
				},
			},
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
				},
			},
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
				},
			},
		}),
		// Row styles
		getPort({
			plug: 'input',
			name: 'rowStyles',
			group: 'Row styles',
			type: 'boolean',
			displayName: 'Enabled',
			default: false,
		}),
		getPort({
			plug: 'input',
			name: 'withRowBorders',
			group: 'Row styles',
			type: 'boolean',
			displayName: 'Row borders',
			default: true,
			customs: {
				dependsOn(p) {
					return p.rowStyles ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'striped',
			group: 'Row styles',
			type: 'boolean',
			displayName: 'Striped',
			default: false,
			customs: {
				dependsOn(p) {
					return p.rowStyles ? true : false;
				},
			},
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
				},
			},
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
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'highlightOnHover',
			group: 'Row styles',
			type: 'boolean',
			displayName: 'Highlight on hover',
			default: false,
			customs: {
				dependsOn(p) {
					return p.rowStyles ? true : false;
				},
			},
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
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'singleSelectionRowBgColor',
			group: 'Row styles',
			type: 'string',
			default: 'white', // дефолтно, предлагаем не выделять строку цветом
			displayName: 'Single selection bg color',
			customs: {
				dependsOn(p) {
					return p.rowStyles && p.onRowClick === 'singleSelection';
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'mutliSelectionRowBgColor',
			group: 'Row styles',
			type: 'string',
			default: 'white', // дефолтно, предлагаем не выделять строку цветом
			displayName: 'Mutli selection bg color',
			customs: {
				dependsOn(p) {
					return p.rowStyles && p.multiSelection;
				},
			},
		}),
		// Single selection
		getPort({
			plug: 'input',
			name: 'defaultSelectedItem',
			group: 'Single selection',
			displayName: 'Default selected item',
			type: 'object',
			customs: {
				dependsOn(p) {
					return p.onRowClick === 'singleSelection';
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'selectedItem',
			group: 'Single selection',
			displayName: 'Selected item',
			type: 'object',
			customs: {
				dependsOn(p) {
					return p.onRowClick === 'singleSelection';
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'setSelectedItem',
			displayName: 'Set selected item',
			group: 'Single selection',
			type: 'signal',
			customs: {
				dependsOn(p) {
					return p.onRowClick === 'singleSelection';
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'resetSelectedItem',
			displayName: 'Reset selected item',
			group: 'Single selection',
			type: 'signal',
			customs: {
				dependsOn(p) {
					return p.onRowClick === 'singleSelection';
				},
			},
		}),
		// Multi selection
		getPort({
			plug: 'input',
			name: 'multiSelection',
			group: 'Multi selection',
			type: 'boolean',
			displayName: 'Enabled',
			default: false,
		}),
		getPort({
			plug: 'input',
			name: 'multiSelectionFilterFunc',
			group: 'Multi selection',
			type: 'array',
			displayName: 'Filter func',
			customs: {
				isObject: true,
				dependsOn(p) {
					return p.multiSelection ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'defaultSelectedItems',
			displayName: 'Default selected items',
			group: 'Multi selection',
			type: getType('array', 'connection'),
			customs: {
				dependsOn(p) {
					return p.multiSelection ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'selectedItems',
			displayName: 'Selected items',
			group: 'Multi selection',
			type: getType('array', 'connection'),
			customs: {
				dependsOn(p) {
					return p.multiSelection ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'setSelectedItems',
			displayName: 'Set selected items',
			group: 'Multi selection',
			type: 'signal',
			customs: {
				dependsOn(p) {
					return p.multiSelection ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'resetSelectedItems',
			displayName: 'Reset selected items',
			group: 'Multi selection',
			type: 'signal',
			customs: {
				dependsOn(p) {
					return p.multiSelection ? true : false;
				},
			},
		}),
		// Expansion
		getPort({
			plug: 'input',
			name: 'expansion',
			group: 'Expansion',
			type: 'boolean',
			displayName: 'Enabled',
			default: false,
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
				},
			},
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
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'expansionFilterFunc',
			group: 'Expansion',
			type: 'array',
			displayName: 'Filter func',
			customs: {
				isObject: true,
				dependsOn(p) {
					return p.expansion ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'paddingLeft',
			group: 'Expansion',
			type: 'number',
			displayName: 'Left padding',
			default: 16,
			customs: {
				dependsOn(p) {
					return p.expansion ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'defaultExpandedItems',
			group: 'Expansion',
			type: getType('array', 'connection'),
			displayName: 'Default expanded items',
			customs: {
				dependsOn(p) {
					return p.expansion ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'setExpandedItems',
			group: 'Expansion',
			type: 'signal',
			displayName: 'Set expanded items',
			customs: {
				dependsOn(p) {
					return p.expansion && p.allowMultiple;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'expandedItems',
			group: 'Expansion',
			type: getType('array', 'connection'),
			displayName: 'Expanded items',
			customs: {
				dependsOn(p) {
					return p.expansion ? true : false;
				},
			},
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
				},
			},
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
				},
			},
		}),
		// Sort
		getPort({
			plug: 'input',
			name: 'sort',
			group: 'Sort',
			type: 'boolean',
			displayName: 'Enabled',
			default: false,
		}),
		getPort({
			plug: 'input',
			name: 'sortType',
			group: 'Sort',
			displayName: 'Type',
			type: getCustomEnumType(['frontend', 'backend']),
			default: 'frontend',
			customs: {
				dependsOn(p) {
					return p.sort ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'sortedIcon',
			group: 'Sort',
			type: 'string',
			displayName: 'Sorted icon',
			default: 'IconArrowUp',
			customs: {
				required: 'both',
				dependsOn(p) {
					return p.sort ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'unsortedIcon',
			group: 'Sort',
			type: 'string',
			displayName: 'Unsorted icon',
			default: 'IconSelector',
			customs: {
				required: 'both',
				dependsOn(p) {
					return p.sort ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'resetSort',
			group: 'Sort',
			type: 'signal',
			displayName: 'Reset sort',
			customs: {
				dependsOn(p) {
					return p.sort ? true : false;
				},
			},
		}),
		getPort({
			plug: 'input',
			name: 'restoreDefaultSort',
			group: 'Sort',
			type: 'signal',
			displayName: 'Restore default',
			customs: {
				dependsOn(p) {
					return p.sort ? true : false;
				},
			},
		}),
	],
	outputs: [
		/*
	// Table Id and parentTableId
	'tableId',
	'parentTableId' */
		// Base
		getPort({
			plug: 'output',
			name: 'level',
			group: 'Base',
			type: 'number',
			displayName: 'Level',
		}),
		getPort({
			plug: 'output',
			name: 'clickedItem',
			group: 'Base',
			type: 'object',
			displayName: 'Clicked item',
			customs: {
				dependsOn(p) {
					return p.onRowClick === 'signal';
				},
			},
		}),
		getPort({
			plug: 'output',
			name: 'rowClicked',
			group: 'Base',
			type: 'signal',
			displayName: 'Row clicked',
			customs: {
				dependsOn(p) {
					return p.onRowClick === 'signal';
				},
			},
		}),
		// Single selection
		getPort({
			plug: 'output',
			name: 'selectedItem',
			group: 'Single selection',
			type: 'object',
			displayName: 'Selected item',
			customs: {
				dependsOn(p) {
					return p.onRowClick === 'singleSelection';
				},
			},
		}),
		getPort({
			plug: 'output',
			name: 'selectedItemChanged',
			group: 'Single selection',
			type: 'signal',
			displayName: 'Selected item changed',
			customs: {
				dependsOn(p) {
					return p.onRowClick === 'singleSelection';
				},
			},
		}),
		// Multi selection
		getPort({
			plug: 'output',
			name: 'selectedItems',
			group: 'Multi selection',
			type: 'array',
			displayName: 'Selected items',
			customs: {
				dependsOn(p) {
					return p.multiSelection ? true : false;
				},
			},
		}),
		getPort({
			plug: 'output',
			name: 'selectedItemsChanged',
			group: 'Multi selection',
			type: 'signal',
			displayName: 'Selected items changed',
			customs: {
				dependsOn(p) {
					return p.multiSelection ? true : false;
				},
			},
		}),
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
				},
			},
		}),
		getPort({
			plug: 'output',
			name: 'expandedItemsChanged',
			group: 'Expansion',
			type: 'signal',
			displayName: 'Expanded items changed',
			customs: {
				dependsOn(p) {
					return p.expansion ? true : false;
				},
			},
		}),
		// Sort
		getPort({
			plug: 'output',
			name: 'sortValue',
			group: 'Sort',
			type: 'object',
			displayName: 'Sort value',
			customs: {
				dependsOn(p) {
					return p.sort ? true : false;
				},
			},
		}),
	],
};

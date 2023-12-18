import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v1_2_0 from './v1.2.0/Table'
import v1_2_1 from './v1.2.1/Table'
import v1_3_0 from './v1.3.0/Table'
import v1_3_1 from './v1.3.1/Table'
import v1_4_0 from './v1.4.0/Table'
import v1_5_0 from './v1.5.0/Table'
import v2_0_0 from './v2.0.0/Table'
import v2_1_0 from './v2.1.0/Table'

//===================================================================

const compVersions: CompVersions = {
    'v1.2.0': {
        hashTag: 'deprecated',
        Comp: v1_2_0,
        inputs: [
            // params, data
            ...getPorts('input', ['tableVariant', 'columns', 'selectable', 'items']),
            // states            
            ...getPorts('input', ['tableLoading', 'tableSearching']),
            // layout
            ...getPorts('input', ['disableHeader', 'stickyHeader', 'tableDensity']),
            // dimensions
            ...getPorts('input', ['tableWidth', 'defaultColumnSize', 'dynamicHeight', 'tableMaxHeight', 'tableViewportBOffset',
                'tableLoaderSize']),
            // table style
            ...getPorts('input', ['tableRadius', 'tableShadow', 'tableWithBorder', 'withColumnBorders', 'tableLoaderColor']),
            // selectable
            ...getPorts('input', ['singleSelectable', 'singleUnselectable', 'multiSelectable', 'allSelectable']),
            // row style
            ...getPorts('input', ['rowsWithBorder', 'rowBackgroundColor', 'highlightOnHover', 'onHoverColor',
                'highlightSelectedRow', 'selectedRowColor', 'multiSelectCheckboxColor']),

            //// grouped
            // params
            ...getPorts('input', ['expandAllAction', 'expendOn']),
        ],
        outputs: [...getPorts('output', ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem'],)],
        signals: getPorts('input', ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetMultipleSelected']),
    },
    'v1.2.1': {
        hashTag: 'deprecated',
        Comp: v1_2_1,
        inputs: [
            // params, data
            ...getPorts('input', ['tableVariant', 'columns', 'selectable', 'items']),
            // states            
            ...getPorts('input', ['tableLoading', 'tableSearching']),
            // layout
            ...getPorts('input', ['disableHeader', 'stickyHeader', 'tableDensity']),
            // dimensions
            ...getPorts('input', ['tableWidth', 'defaultColumnSize', 'dynamicHeight', 'tableMaxHeight', 'tableViewportBOffset',
                'tableLoaderSize']),
            // table style
            ...getPorts('input', ['tableRadius', 'tableShadow', 'tableWithBorder', 'withColumnBorders', 'tableLoaderColor']),
            // selectable
            ...getPorts('input', ['singleSelectable', 'singleUnselectable', 'multiSelectable', 'allSelectable']),
            // row style
            ...getPorts('input', ['rowsWithBorder', 'rowBackgroundColor', 'highlightOnHover', 'onHoverColor',
                'highlightSelectedRow', 'selectedRowColor', 'multiSelectCheckboxColor']),

            //// grouped
            // params
            ...getPorts('input', ['expandAllAction', 'expendOn']),
        ],
        outputs: [...getPorts('output', ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem'],)],
        signals: getPorts('input', ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetMultipleSelected']),
    },
    'v1.3.0': {
        hashTag: 'deprecated',
        Comp: v1_3_0,
        inputs: [
            // params, data
            ...getPorts('input', ['tableVariant', 'columns', 'selectable', 'items']),
            // states            
            ...getPorts('input', ['tableLoading', 'tableSearching']),
            // layout
            ...getPorts('input', ['disableHeader', 'stickyHeader', 'tableDensity']),
            // dimensions
            ...getPorts('input', ['tableWidth', 'defaultColumnSize', 'dynamicHeight', 'tableMaxHeight', 'tableViewportBOffset',
                'tableLoaderSize']),
            // table style
            ...getPorts('input', ['tableRadius', 'tableShadow', 'tableWithBorder', 'withColumnBorders', 'tableLoaderColor']),
            // selectable
            ...getPorts('input', ['singleSelectable', 'singleUnselectable', 'multiSelectable', 'allSelectable']),
            // row style
            ...getPorts('input', ['rowsWithBorder', 'rowBackgroundColor', 'highlightOnHover', 'onHoverColor',
                'highlightSelectedRow', 'selectedRowColor', 'multiSelectCheckboxColor']),

            //// grouped
            // params
            ...getPorts('input', ['expandAllAction', 'expendOn']),
        ],
        outputs: [...getPorts('output', ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem'],)],
        signals: getPorts('input', ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetMultipleSelected']),
    },
    'v1.3.1': {
        Comp: v1_3_1,
        inputs: [
            // params, data
            ...getPorts('input', ['tableVariant', 'columns', 'selectable', 'items']),
            // states            
            ...getPorts('input', ['tableLoading', 'tableSearching']),
            // layout
            ...getPorts('input', ['disableHeader', 'stickyHeader', 'tableDensity']),
            // dimensions
            ...getPorts('input', ['tableWidth', 'defaultColumnSize', 'dynamicHeight', 'tableMaxHeight', 'tableViewportBOffset',
                'tableLoaderSize']),
            // table style
            ...getPorts('input', ['tableRadius', 'tableShadow', 'tableWithBorder', 'withColumnBorders', 'tableLoaderColor']),
            // selectable
            ...getPorts('input', ['singleSelectable', 'singleUnselectable', 'multiSelectable', 'allSelectable']),
            // row style
            ...getPorts('input', ['rowsWithBorder', 'rowBackgroundColor', 'highlightOnHover', 'onHoverColor',
                'highlightSelectedRow', 'selectedRowColor', 'multiSelectCheckboxColor']),

            //// grouped
            // params
            ...getPorts('input', ['expandAllAction', 'expendOn']),
        ],
        outputs: [...getPorts('output', ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem'],)],
        signals: getPorts('input', ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetMultipleSelected']),
    },
    'v1.4.0': {
        Comp: v1_4_0,
        inputs: [
            // params, data
            ...getPorts('input', ['tableVariant', 'columns', 'selectable', 'items']),
            // states            
            ...getPorts('input', ['tableLoading', 'tableRefreshing']),
            // layout
            ...getPorts('input', ['disableHeader', 'stickyHeader', 'tableDensity']),
            // dimensions
            ...getPorts('input', ['tableWidth', 'defaultColumnSize', 'dynamicHeight', 'tableMaxHeight', 'tableViewportBOffset',
                'tableLoaderSize']),
            // table style
            ...getPorts('input', ['tableRadius', 'tableShadow', 'tableWithBorder', 'withColumnBorders', 'tableLoaderColor']),
            // selectable
            ...getPorts('input', ['singleSelectable', 'singleUnselectable', 'groupedRowSelectable', 'groupedRowUnselectable',
                'multiSelectable', 'allSelectable']),
            // row style
            ...getPorts('input', ['rowsWithBorder', 'rowBackgroundColor', 'highlightOnHover', 'onHoverColor',
                'highlightSelectedRow', 'highlightSelectedGroupedRow', 'selectedRowColor', 'selectedGroupedRowColor',
                'multiSelectCheckboxColor']),

            //// grouped
            // params
            ...getPorts('input', ['expandAllAction', 'expandOn']),
        ],
        outputs: [...getPorts('output', ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem',
            'groupedRowSelected', 'selectedGroupedItem'],)],
        signals: getPorts('input', ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetGroupedRowSelection',
            'resetMultipleSelected']),
    },
    'v1.5.0': {
        Comp: v1_5_0,
        inputs: [
            // params, data
            ...getPorts('input', ['tableVariant', 'columns', 'selectable', 'items']),
            // states            
            ...getPorts('input', ['tableLoading', 'tableRefreshing']),
            // layout
            ...getPorts('input', ['disableHeader', 'stickyHeader', 'tableDensity']),
            // dimensions
            ...getPorts('input', ['tableWidth', 'defaultColumnSize', 'dynamicHeight', 'tableMaxHeight', 'tableViewportBOffset',
                'tableLoaderSize']),
            // table style
            ...getPorts('input', ['tableRadius', 'tableShadow', 'tableWithBorder', 'withColumnBorders', 'tableLoaderColor']),
            // selectable
            ...getPorts('input', ['singleSelectable', 'singleUnselectable', 'groupedRowSelectable', 'groupedRowUnselectable',
                'multiSelectable', 'allSelectable']),
            // row style
            ...getPorts('input', ['rowsWithBorder', 'rowBackgroundColor', 'highlightOnHover', 'onHoverColor',
                'highlightSelectedRow', 'highlightSelectedGroupedRow', 'selectedRowColor', 'selectedGroupedRowColor',
                'multiSelectCheckboxColor']),

            //// grouped
            // params
            ...getPorts('input', ['expandAllAction', 'expandOn']),
        ],
        outputs: [...getPorts('output', ['singleSelected', 'selectedItem', 'selectedItems', 'actionName', 'actionItem',
            'groupedRowSelected', 'selectedGroupedItem'],)],
        signals: getPorts('input', ['expandAll', 'unExpandAll', 'resetSingleSelected', 'resetGroupedRowSelection',
            'resetMultipleSelected']),
    },
    'v2.0.0': {
        hashTag: 'experimental',
        Comp: v2_0_0,
        inputs: getPorts('input', [
            // Enablers
            'table2SingleSelection', 'table2MultiSelection', 'table2Sort', 'table2FilterEnabled', 'table2Expansion', 'table2Layout',
            'table2Dimensions', 'table2TableStyles', 'table2RowStyles',
            // Params
            'table2Columns', 'table2OnRowClick', 'table2TextSelection',
            // Data
            'table2Items',
            // Single selection
            'table2SingleSelectedItem', 'table2Unselectable',
            // Multi selection
            'table2MultiSelectedItems',
            // Sort
            'table2SortType', 'table2SortedIcon', 'table2UnsortedIcon',
            // Filter
            'table2FilterType',
            // Expansion    
            'table2ExpandedItems', 'table2AllowMultiple',
            // Layout
            'table2NoHeader',
            // Dimensions
            'table2Width', 'table2MinHeight', 'table2DynamicHeight', 'table2ViewportBOffset', //'table2MaxHeight',
            'table2HorizontalSpacing', 'table2VerticalSpacing', 'table2FontSize',
            // Table styles
            'table2Shadow', 'table2WithBorder', 'table2BorderRadius', 'table2ColumnBorders', 'table2Animation', 'table2LoaderColor',
            // Row styles
            'table2RowBorders', 'table2Striped', 'table2OddBgColor', 'table2EvenBgColor', 'table2RowBgColor', 'table2HighlightOnHover',
            'table2OnHoverBgColor', 'table2SingleSelectedRowBgColor', 'table2MutliSelectedRowBgColor',
            // States
            'table2Fetching',
        ]),
        outputs: getPorts('output', [
            // Single selection
            'table2SingleSelectedItem', 'table2SingleSelected', 'table2SingleUnselected',
            // Multi selection
            'table2MultiSelectedItems', 'table2MultiSelectionChanged',
            // Sort
            'table2SortValue',
            // Expansion    
            'table2ExpandedItems', 'table2ExpansionChanged',
        ]),
        signals: getPorts('input', [
            'table2ResetSingleSelection', 'table2ResetMultiSelection', 'table2ResetSort', 'table2ExpandAll', 'table2UnexpandAll',
            'table2ResetFilters'
        ])
    },
    'v2.1.0': {
        hashTag: 'experimental',
        Comp: v2_1_0,
        inputs: getPorts('input', [
            // Enablers
            'table2SingleSelection', 'table2MultiSelection', 'table2Sort', 'table2FilterEnabled', 'table2Expansion', 'table2Layout',
            'table2Dimensions', 'table2TableStyles', 'table2RowStyles',
            // Params
            'table2Columns', 'table2OnRowClick', 'table2TextSelection',
            // Data
            'table2Items',
            // Single selection
            'table2SingleSelectedItem', 'table2Unselectable',
            // Multi selection
            'table2MultiSelectedItems',
            // Sort
            'table2SortType', 'table2SortedIcon', 'table2UnsortedIcon',
            // Filter
            'table2FilterType',
            // Expansion    
            'table2ExpandedItems', 'table2AllowMultiple',
            // Layout
            'table2NoHeader',
            // Dimensions
            'table2Width', 'table2MinHeight', 'table2DynamicHeight', 'table2ViewportBOffset', 'table2Height',
            'table2HorizontalSpacing', 'table2VerticalSpacing', 'table2FontSize',
            // Table styles
            'table2Shadow', 'table2WithBorder', 'table2BorderRadius', 'table2ColumnBorders', 'table2Animation', 'table2LoaderColor',
            // Row styles
            'table2RowBorders', 'table2Striped', 'table2OddBgColor', 'table2EvenBgColor', 'table2RowBgColor', 'table2HighlightOnHover',
            'table2OnHoverBgColor', 'table2SingleSelectedRowBgColor', 'table2MutliSelectedRowBgColor',
            // States
            'table2Fetching',
        ]),
        outputs: getPorts('output', [
            // Single selection
            'table2SingleSelectedItem', 'table2SingleSelected', 'table2SingleUnselected',
            // Multi selection
            'table2MultiSelectedItems', 'table2MultiSelectionChanged',
            // Sort
            'table2SortValue',
            // Expansion    
            'table2ExpandedItems', 'table2ExpansionChanged',
        ]),
        signals: getPorts('input', [
            'table2ResetSingleSelection', 'table2ResetMultiSelection', 'table2ResetSort', 'table2ExpandAll', 'table2UnexpandAll',
            'table2ResetFilters'
        ])
    },
}

//===================================================================

export default getReactNode('Table', compVersions, true)
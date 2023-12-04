import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v1_2_0 from './v1.2.0/Table'
import v1_2_1 from './v1.2.1/Table'
import v1_3_0 from './v1.3.0/Table'
import v1_3_1 from './v1.3.1/Table'
import v1_4_0 from './v1.4.0/Table'
import v1_5_0 from './v1.5.0/Table'
import v2_0_0 from './v2.0.0/Table'

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
            'table2Columns',
            // Data
            'items', 'table2DefaultSelectedItem', 'table2DefaultSorts',
            // States
            'table2Fetching',
            // Layout
            'table2NoHeader', //'table2VerticalAlignment',
            // Dimensions
            'table2Width', 'table2MinHeight', 'table2DynamicHeight', 'table2MaxHeight', 'table2ViewportBOffset', 'table2HorizontalSpacing',
            'table2VerticalSpacing', 'table2FontSize',
            // Style
            'table2WithBorder', 'table2BorderRadius', 'table2WithColumnBorders',
            'table2Shadow',
            // Selectable
            'table2Selectable', 'table2SingleRowSelectable',
            // Row style
            'table2RowBackgroundColor', 'table2Striped', 'table2HighlightOnHover', 'table2RowOnHoverBackgroundColor',
            'table2SelectedRowBackgroundColor'
        ]),
        outputs: getPorts('output', ['selectedItem', 'table2ExpandChanged', 'table2ExpandedItems', 'table2Sorts'])
    }
}

//===================================================================

export default getReactNode('Table', compVersions, true)
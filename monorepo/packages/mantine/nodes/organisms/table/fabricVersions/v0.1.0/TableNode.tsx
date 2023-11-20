import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v1_2_0 from './v1.2.0/Table'
import v1_2_1 from './v1.2.1/Table'
import v1_3_0 from './v1.3.0/Table'
import v1_3_1 from './v1.3.1/Table'
import v1_4_0 from './v1.4.0/Table'
import v1_5_0 from './v1.5.0/Table'

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
    }
}

//===================================================================

export default getReactNode('Table', compVersions, false)
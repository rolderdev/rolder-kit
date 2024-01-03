import { enums } from "../enums";
const units = ['rem', '%', 'px']
const heightUnits = ['rem', 'px']

const table = [
    { name: 'tableVariant', group: 'Version', type: { name: 'enum', enums: enums.tableVariants }, displayName: 'Variant', default: 'basic' },
    //// inputs
    // params
    { name: 'columns', group: 'Params', type: 'array', displayName: 'Columns', required: true },
    { name: 'selectable', group: 'Params', type: 'boolean', displayName: 'Selectable', default: false, },
    // states
    { name: 'tableLoading', group: 'States', type: 'boolean', displayName: 'Loading', default: true },
    { name: 'tableSearching', group: 'States', type: 'boolean', displayName: 'Searching #deprecated', default: false },
    { name: 'tableRefreshing', group: 'States', type: 'boolean', displayName: 'Refreshing', default: false },
    // layout    
    { name: 'disableHeader', group: 'Layout', type: 'boolean', displayName: 'Disable header', default: false },
    { name: 'stickyHeader', group: 'Layout', type: 'boolean', displayName: 'Sticky header', default: true, dependsOn: [{ name: 'disableHeader', value: false }] },
    { name: 'tableDensity', group: 'Layout', type: { name: 'enum', enums: enums.tableDensities }, displayName: 'Density', default: 'xs' },
    // dimensions
    { name: 'tableWidth', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width' },
    { name: 'defaultColumnSize', group: 'Dimensions', type: 'number', displayName: 'Default column size', default: 100 },
    { name: 'dynamicHeight', group: 'Dimensions', type: 'boolean', displayName: 'Dynamic height', default: false },
    { name: 'tableMaxHeight', group: 'Dimensions', type: { name: 'number', units: heightUnits, defaultUnit: 'rem' }, displayName: 'Max height', dependsOn: [{ name: 'dynamicHeight', value: false }] },
    { name: 'tableViewportBOffset', group: 'Dimensions', type: { name: 'number', units: heightUnits, defaultUnit: 'rem' }, displayName: 'Viewport bottom offset', dependsOn: [{ name: 'dynamicHeight', value: true }] },
    { name: 'tableLoaderSize', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Loader size', default: 'md' },
    // table style
    { name: 'tableRadius', group: 'Table style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Radius', default: 'md' },
    { name: 'tableShadow', group: 'Table style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Shadow', default: 'sm' },
    { name: 'tableWithBorder', group: 'Table style', type: 'boolean', displayName: 'With border', default: false },
    { name: 'withColumnBorders', group: 'Table style', type: 'boolean', displayName: 'Column borders', default: false },
    { name: 'tableLoaderColor', group: 'Table style', type: 'string', displayName: 'Loader color', tooltip: 'red, red.5' },
    // selectable
    { name: 'singleSelectable', group: 'Selectable', type: 'boolean', displayName: 'Single select', default: false, dependsOn: [{ name: 'selectable', value: true }] },
    { name: 'singleUnselectable', group: 'Selectable', type: 'boolean', displayName: 'Single unselect', default: false, dependsOn: [{ name: 'singleSelectable', value: true }, { name: 'selectable', value: true }] },
    { name: 'multiSelectable', group: 'Selectable', type: 'boolean', displayName: 'Multi select', default: false, dependsOn: [{ name: 'selectable', value: true }] },
    { name: 'allSelectable', group: 'Selectable', type: 'boolean', displayName: 'All select', default: true, dependsOn: [{ name: 'selectable', value: true }, { name: 'multiSelectable', value: true }] },
    { name: 'groupedRowSelectable', group: 'Selectable', type: 'boolean', displayName: 'Grouped row select', default: false, dependsOn: [{ name: 'selectable', value: true }, { name: 'expandOn', value: 'icon' }] },
    { name: 'groupedRowUnselectable', group: 'Selectable', type: 'boolean', displayName: 'Grouped row unselect', default: false, dependsOn: [{ name: 'groupedRowSelectable', value: true }, { name: 'selectable', value: true }, { name: 'expandOn', value: 'icon' }] },
    { name: 'selectedGroupedItem', group: 'Data', type: 'object', displayName: 'Selected grouped item' },

    // row style
    { name: 'rowsWithBorder', group: 'Row style', type: 'boolean', displayName: 'Row borders', default: false },
    { name: 'rowBackgroundColor', group: 'Row style', type: 'string', displayName: 'Background color', tooltip: 'red, red.5' },
    { name: 'highlightOnHover', group: 'Row style', type: 'boolean', displayName: 'Hightlight on hover', default: false, dependsOn: [{ name: 'singleSelectable', value: true }, { name: 'selectable', value: true }] },
    { name: 'onHoverColor', group: 'Row style', type: 'string', displayName: 'On hover color', tooltip: 'red, red.5', dependsOn: [{ name: 'singleSelectable', value: true }, { name: 'selectable', value: true }, { name: 'highlightOnHover', value: true }] },
    { name: 'highlightSelectedRow', group: 'Row style', type: 'boolean', displayName: 'Hightlight selected row', default: false, dependsOn: [{ name: 'singleSelectable', value: true }, { name: 'selectable', value: true }] },
    { name: 'selectedRowColor', group: 'Row style', type: 'string', displayName: 'Selected row color', tooltip: 'red, red.5', dependsOn: [{ name: 'singleSelectable', value: true }, { name: 'selectable', value: true }, { name: 'highlightSelectedRow', value: true }] },
    { name: 'multiSelectCheckboxColor', group: 'Row style', type: 'string', displayName: 'Checkbox color', tooltip: 'red, red.5', dependsOn: [{ name: 'multiSelectable', value: true }, { name: 'selectable', value: true }] },
    { name: 'highlightSelectedGroupedRow', group: 'Row style', type: 'boolean', displayName: 'Hightlight selected grouped row', default: false, dependsOn: [{ name: 'groupedRowSelectable', value: true }, { name: 'selectable', value: true }] },
    { name: 'selectedGroupedRowColor', group: 'Row style', type: 'string', displayName: 'Selected grouped row color', tooltip: 'red, red.5', dependsOn: [{ name: 'groupedRowSelectable', value: true }, { name: 'selectable', value: true }, { name: 'highlightSelectedGroupedRow', value: true }] },

    // signals    
    { name: 'singleSelected', group: 'Signals', type: 'signal', displayName: 'Single selected' },
    { name: 'resetSingleSelected', group: 'Signals', type: 'signal', displayName: 'Reset single selection' },
    { name: 'resetMultipleSelected', group: 'Signals', type: 'signal', displayName: 'Reset multiple selection' },

    //// grouped
    { name: 'expendOn', group: 'Grouped params', type: { name: 'enum', enums: enums.expandOnVariants }, displayName: 'Expend on #deprecated', default: 'row', dependsOn: [{ name: 'tableVariant', value: 'grouped' }] },
    { name: 'expandOn', group: 'Grouped params', type: { name: 'enum', enums: enums.expandOnVariants }, displayName: 'Expand on', default: 'row', dependsOn: [{ name: 'tableVariant', value: 'grouped' }] },
    { name: 'expandAllAction', group: 'Grouped params', type: 'boolean', displayName: 'Expand all', default: true, dependsOn: [{ name: 'tableVariant', value: 'grouped' }] },
    // signals
    { name: 'expandAll', group: 'Signals', type: 'signal', displayName: 'Expand all rows', dependsOn: [{ name: 'tableVariant', value: 'grouped' }] },
    { name: 'unExpandAll', group: 'Signals', type: 'signal', displayName: 'Unexpand all rows', dependsOn: [{ name: 'tableVariant', value: 'grouped' }] },

    //// outputs
    { name: 'actionItem', group: 'Data', type: 'object', displayName: 'Action item' },
    { name: 'actionName', group: 'Signals', type: 'string', displayName: 'Action name' },
    // signals    
    { name: 'groupedRowSelected', group: 'Signals', type: 'signal', displayName: 'Grouped row selected' },
    { name: 'resetGroupedRowSelection', group: 'Signals', type: 'signal', displayName: 'Reset grouped row selection' },
] as const satisfies readonly NodePort[];

export default table
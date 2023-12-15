import { enums } from "../enums";
const units = ['rem', '%', 'px']
const heightUnits = ['rem', 'px']

export default [
    // Enablers
    { name: 'table2SingleSelection', group: 'Enablers', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Single selection', default: false },
    { name: 'table2MultiSelection', group: 'Enablers', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Multi selection', default: false },
    { name: 'table2Sort', group: 'Enablers', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Sort', default: false },
    { name: 'table2Expansion', group: 'Enablers', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Expansion', default: false },
    { name: 'table2Layout', group: 'Enablers', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Layout', default: false },
    { name: 'table2Dimensions', group: 'Enablers', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Dimensions', default: false },
    { name: 'table2TableStyles', group: 'Enablers', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Table styles', default: false },
    { name: 'table2RowStyles', group: 'Enablers', type: { name: 'boolean', allowEditOnly: true }, displayName: 'Row styles', default: false },
    // Params
    { name: 'table2Columns', group: 'Params', type: 'array', displayName: 'Columns', required: true },
    { name: 'table2OnRowClick', group: 'Params', type: { name: 'enum', enums: enums.table2OnRowClicks }, displayName: 'On row click', default: 'disabled' },
    { name: 'table2TextSelection', group: 'Params', type: 'boolean', displayName: 'Text selection', default: true },
    { name: 'table2ColumnIndex', group: 'Params', type: 'number', displayName: 'Column index', required: true },
    { name: 'table2Controlled', group: 'Params', type: 'boolean', displayName: 'Controlled', default: false },
    // Data
    { name: 'table2Items', group: 'Data', type: 'array', displayName: 'Items' },
    // Single selection
    { name: 'table2SingleSelectedItem', group: 'Single selection', type: 'object', displayName: 'Single selected item', dependsOn: [{ name: 'table2SingleSelection', value: true }] },
    { name: 'table2Unselectable', group: 'Single selection', type: 'boolean', displayName: 'Unselectable', default: false, dependsOn: [{ name: 'table2SingleSelection', value: true }] },
    { name: 'table2SingleSelected', group: 'Single selection', type: 'signal', displayName: 'Single selected', dependsOn: [{ name: 'table2SingleSelection', value: true }] },
    { name: 'table2SingleUnselected', group: 'Single selection', type: 'signal', displayName: 'Single unselected', dependsOn: [{ name: 'table2SingleSelection', value: true }, { name: 'table2Unselectable', value: true }] },
    { name: 'table2ResetSingleSelection', group: 'Single selection', type: 'signal', displayName: 'Reset single selection', dependsOn: [{ name: 'table2SingleSelection', value: true }] },
    // Multi selection
    { name: 'table2MultiSelectedItems', group: 'Multi selection', type: 'array', displayName: 'Multi selected items', dependsOn: [{ name: 'table2MultiSelection', value: true }] },
    { name: 'table2MultiSelectionChanged', group: 'Multi selection', type: 'signal', displayName: 'Multi selection changed', dependsOn: [{ name: 'table2MultiSelection', value: true }] },
    { name: 'table2ResetMultiSelection', group: 'Multi selection', type: 'signal', displayName: 'Reset multi selection', dependsOn: [{ name: 'table2MultiSelection', value: true }] },
    // Sort
    { name: 'table2SortType', group: 'Sort', type: { name: 'enum', enums: enums.table2sortTypes }, displayName: 'Type', default: 'frontend', dependsOn: [{ name: 'table2Sort', value: true }] },
    { name: 'table2SortValue', group: 'Sort', type: 'array', displayName: 'Sort value', dependsOn: [{ name: 'table2Sort', value: true }] },
    { name: 'table2ResetSort', group: 'Sort', type: 'signal', displayName: 'Reset sort', dependsOn: [{ name: 'table2Sort', value: true }] },
    { name: 'table2SortedIcon', group: 'Sort', type: 'string', displayName: 'Sorted icon', default: 'IconArrowUp', dependsOn: [{ name: 'table2Sort', value: true }] },
    { name: 'table2UnsortedIcon', group: 'Sort', type: 'string', displayName: 'Unsorted icon', default: 'IconSelector', dependsOn: [{ name: 'table2Sort', value: true }] },
    // Filter    
    { name: 'table2FilterValue', group: 'Filter', type: '*', displayName: 'Filter value' },
    { name: 'table2SetFilterValue', group: 'Filter', type: 'signal', displayName: 'Set filter value' },
    { name: 'table2Filter', group: 'Filter', type: 'signal', displayName: 'Filter' },
    // Expansion    
    { name: 'table2ExpandedItems', group: 'Expansion', type: 'array', displayName: 'Expanded items', dependsOn: [{ name: 'table2Expansion', value: true }] },
    { name: 'table2AllowMultiple', group: 'Expansion', type: 'boolean', displayName: 'Allow multiple', dependsOn: [{ name: 'table2Expansion', value: true }] },
    { name: 'table2ExpansionChanged', group: 'Expansion', type: 'signal', displayName: 'Expansion changed', dependsOn: [{ name: 'table2Expansion', value: true }] },
    { name: 'table2ExpandAll', group: 'Expansion', type: 'signal', displayName: 'Expand all', dependsOn: [{ name: 'table2Expansion', value: true }, { name: 'table2AllowMultiple', value: true }] },
    { name: 'table2UnexpandAll', group: 'Expansion', type: 'signal', displayName: 'Unexpand all', dependsOn: [{ name: 'table2Expansion', value: true }, { name: 'table2AllowMultiple', value: true }] },
    // Layout
    { name: 'table2NoHeader', group: 'Layout', type: 'boolean', displayName: 'No header', default: false, dependsOn: [{ name: 'table2Layout', value: true }] },
    // Dimensions
    { name: 'table2Width', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width', dependsOn: [{ name: 'table2Dimensions', value: true }] },
    { name: 'table2MinHeight', group: 'Dimensions', type: { name: 'number', units: heightUnits, defaultUnit: 'px' }, default: 126, displayName: 'Min height', dependsOn: [{ name: 'table2Dimensions', value: true }] },
    { name: 'table2DynamicHeight', group: 'Dimensions', type: 'boolean', displayName: 'Dynamic height', default: false, dependsOn: [{ name: 'table2Dimensions', value: true }] },
    { name: 'table2MaxHeight', group: 'Dimensions', type: { name: 'number', units: heightUnits, defaultUnit: 'rem' }, displayName: 'Max height', dependsOn: [{ name: 'table2DynamicHeight', value: false }, { name: 'table2Dimensions', value: true }] },
    { name: 'table2ViewportBOffset', group: 'Dimensions', type: 'number', displayName: 'Viewport bottom offset', default: 0, dependsOn: [{ name: 'table2DynamicHeight', value: true }, { name: 'table2Dimensions', value: true }] },
    { name: 'table2HorizontalSpacing', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Horizontal spacing', default: 'sm', dependsOn: [{ name: 'table2Dimensions', value: true }] },
    { name: 'table2VerticalSpacing', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Vertical spacing', default: 'xs', dependsOn: [{ name: 'table2Dimensions', value: true }] },
    { name: 'table2FontSize', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Font size', default: 'sm', dependsOn: [{ name: 'table2Dimensions', value: true }] },
    // Table styles
    { name: 'table2Shadow', group: 'Table styles', type: { name: 'enum', enums: enums.sizes }, displayName: 'Shadow', default: 'sm', dependsOn: [{ name: 'table2TableStyles', value: true }] },
    { name: 'table2WithBorder', group: 'Table styles', type: 'boolean', displayName: 'With border', default: false, dependsOn: [{ name: 'table2TableStyles', value: true }] },
    { name: 'table2BorderRadius', group: 'Table styles', type: { name: 'enum', enums: enums.sizes }, displayName: 'Border radius', default: 'md', dependsOn: [{ name: 'table2TableStyles', value: true }] },
    { name: 'table2ColumnBorders', group: 'Table styles', type: 'boolean', displayName: 'Column borders', default: false, dependsOn: [{ name: 'table2TableStyles', value: true }] },
    { name: 'table2Animation', group: 'Table styles', type: 'boolean', displayName: 'Animation', default: true, dependsOn: [{ name: 'table2TableStyles', value: true }] },
    { name: 'table2LoaderColor', group: 'Table styles', type: 'string', displayName: 'Loader color', dependsOn: [{ name: 'table2TableStyles', value: true }] },
    // Row styles
    { name: 'table2RowBorders', group: 'Row styles', type: 'boolean', displayName: 'Row borders', default: true, dependsOn: [{ name: 'table2RowStyles', value: true }] },
    { name: 'table2Striped', group: 'Row styles', type: 'boolean', displayName: 'Striped', default: false, dependsOn: [{ name: 'table2RowStyles', value: true }] },
    { name: 'table2OddBgColor', group: 'Row styles', type: 'string', displayName: 'Odd bg color', dependsOn: [{ name: 'table2RowStyles', value: true }, { name: 'table2Striped', value: true }] },
    { name: 'table2EvenBgColor', group: 'Row styles', type: 'string', displayName: 'Even bg color', dependsOn: [{ name: 'table2RowStyles', value: true }, { name: 'table2Striped', value: true }] },
    { name: 'table2RowBgColor', group: 'Row styles', type: 'string', displayName: 'Bg color', dependsOn: [{ name: 'table2RowStyles', value: true }, { name: 'table2Striped', value: false }] },
    { name: 'table2HighlightOnHover', group: 'Row styles', type: 'boolean', displayName: 'Highlight on hover', default: false, dependsOn: [{ name: 'table2RowStyles', value: true }] },
    { name: 'table2OnHoverBgColor', group: 'Row styles', type: 'string', displayName: 'On hover bg color', dependsOn: [{ name: 'table2RowStyles', value: true }, { name: 'table2HighlightOnHover', value: true }] },
    { name: 'table2SingleSelectedRowBgColor', group: 'Row styles', type: 'string', displayName: 'Single selection bg color', dependsOn: [{ name: 'table2RowStyles', value: true }, { name: 'table2SingleSelection', value: true }] },
    { name: 'table2MutliSelectedRowBgColor', group: 'Row styles', type: 'string', displayName: 'Mutli selection bg color', dependsOn: [{ name: 'table2RowStyles', value: true }, { name: 'table2MultiSelection', value: true }] },
    // States
    { name: 'table2Fetching', group: 'States', type: 'boolean', displayName: 'Fetching', default: true },
] as const satisfies readonly NodePort[];
import { enums } from "../enums";
const units = ['rem', '%', 'px']
const heightUnits = ['rem', 'px']

export default [
    { name: 'table2Columns', group: 'Params', type: 'array', displayName: 'Columns', required: true },
    // Data    
    { name: 'table2Sort', group: 'Data', type: 'array', displayName: 'Sort' },
    { name: 'table2DefaultSort', group: 'Data', type: 'array', displayName: 'Default sort' },
    { name: 'table2DefaultSelectedItem', group: 'Data', type: 'object', displayName: 'Default selected item' },
    // states
    { name: 'table2Fetching', group: 'States', type: 'boolean', displayName: 'Fetching', default: true },
    // Layout
    { name: 'table2NoHeader', group: 'Layout', type: 'boolean', displayName: 'No header', default: false },
    { name: 'table2VerticalAlignment', group: 'Layout', type: { name: 'enum', enums: enums.table2VerticalAlignments }, displayName: 'Vertical alignment', default: 'center' },
    // Dimensions
    { name: 'table2Width', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width' },
    { name: 'table2DynamicHeight', group: 'Dimensions', type: 'boolean', displayName: 'Dynamic height', default: false },
    { name: 'table2MaxHeight', group: 'Dimensions', type: { name: 'number', units: heightUnits, defaultUnit: 'rem' }, displayName: 'Max height', dependsOn: [{ name: 'table2DynamicHeight', value: false }] },
    { name: 'table2ViewportBOffset', group: 'Dimensions', type: 'number', displayName: 'Viewport bottom offset', default: 0, dependsOn: [{ name: 'table2DynamicHeight', value: true }] },
    { name: 'table2HorizontalSpacing', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Horizontal spacing', default: 'sm' },
    { name: 'table2VerticalSpacing', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Vertical spacing', default: 'xs' },
    { name: 'table2FontSize', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Font size', default: 'sm' },
    // Table style
    { name: 'table2Shadow', group: 'Table style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Shadow', default: 'sm' },
    { name: 'table2WithBorder', group: 'Table style', type: 'boolean', displayName: 'With border', default: false },
    { name: 'table2BorderRadius', group: 'Table style', type: { name: 'enum', enums: enums.sizes }, displayName: 'Border radius', default: 'md' },
    { name: 'table2WithColumnBorders', group: 'Table style', type: 'boolean', displayName: 'With column border', default: false },
    { name: 'table2Striped', group: 'Table style', type: 'boolean', displayName: 'Striped', default: false },
    { name: 'table2HighlightOnHover', group: 'Table style', type: 'boolean', displayName: 'Highlight on hover', default: false },
    // Selectable    
    { name: 'table2Selectable', group: 'Params', type: 'boolean', displayName: 'Selectable', default: false, },
    { name: 'table2SingleRowSelectable', group: 'Selectable', type: 'boolean', displayName: 'Single row', default: false, dependsOn: [{ name: 'table2Selectable', value: true }] },
    // Row style    
    { name: 'table2RowBackgroundColor', group: 'Row style', type: 'string', displayName: 'Row bg color' },
    { name: 'table2RowOnHoverBackgroundColor', group: 'Row style', type: 'string', displayName: 'On hover row bg color' },
    { name: 'table2SelectedRowBackgroundColor', group: 'Row style', type: 'string', displayName: 'Selected row bg color' },
] as const satisfies readonly NodePort[];
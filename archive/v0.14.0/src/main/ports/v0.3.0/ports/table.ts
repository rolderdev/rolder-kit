import { NodePort } from "../types";
import { enums } from "../enums";

const table = [
    { name: 'columns', group: 'Table params', type: 'array', displayName: 'Columns', required: true },
    { name: 'grouped', group: 'Table params', type: 'boolean', displayName: 'Grouped', default: false, },
    { name: 'expandAllAction', group: 'Table params', type: 'boolean', displayName: 'Expand all', default: true, dependsOn: { name: 'grouped', value: true } },
    { name: 'selectable', group: 'Table params', type: 'boolean', displayName: 'Selectable', default: false, },
    { name: 'singleSelect', group: 'Table params', type: 'boolean', displayName: 'Single select', default: false, dependsOn: { name: 'selectable', value: true } },
    { name: 'singleUnselectable', group: 'Table params', type: 'boolean', displayName: 'Single unselectable', default: false, dependsOn: [{ name: 'singleSelect', value: true }, { name: 'selectable', value: true }] },
    { name: 'multiSelect', group: 'Table params', type: 'boolean', displayName: 'Multi select', default: false, dependsOn: { name: 'selectable', value: true } },
    { name: 'allSelect', group: 'Table params', type: 'boolean', displayName: 'All select', default: true, dependsOn: [{ name: 'selectable', value: true }, { name: 'multiSelect', value: true }] },
    { name: 'tableDensity', group: 'Table layout', type: { name: 'enum', enums: enums.tableDensities }, displayName: 'Density', default: 'xs' },
    { name: 'withColumnBorders', group: 'Table style', type: 'boolean', displayName: 'Column borders', default: false },
    { name: 'highlightOnHover', group: 'Style', type: 'boolean', displayName: 'Hightlight on hover', default: false },
    { name: 'highlightSelected', group: 'Params', type: 'boolean', displayName: 'Hightlight selected', default: false, dependsOn: [{ name: 'singleSelect', value: true }, { name: 'selectable', value: true }] },
    { name: 'onHoverColor', group: 'Table style', type: 'string', displayName: 'On hover color', tooltip: 'red, red.5', dependsOn: [{ name: 'singleSelect', value: true }, { name: 'selectable', value: true }, { name: 'highlightOnHover', value: true }] },
    { name: 'selectedColor', group: 'Table style', type: 'string', displayName: 'Selected color', tooltip: 'red, red.5', dependsOn: [{ name: 'singleSelect', value: true }, { name: 'selectable', value: true }, { name: 'highlightSelected', value: true }] },
    { name: 'multiSelectCheckboxColor', group: 'Table style', type: 'string', displayName: 'Checkbox color', tooltip: 'red, red.5', dependsOn: [{ name: 'multiSelect', value: true }, { name: 'selectable', value: true }] },
    { name: 'singleSelected', group: 'Signals', type: 'signal', displayName: 'Single selected' },
    { name: 'actionName', group: 'Signals', type: 'string', displayName: 'Action name' },
    { name: 'actionItem', group: 'Data', type: 'object', displayName: 'Action item' },
    { name: 'expandAll', group: 'Signals', type: 'signal', displayName: 'Expand all rows' },
    { name: 'unExpandAll', group: 'Signals', type: 'signal', displayName: 'Unexpand all rows' },
    { name: 'resetSingleSelected', group: 'Signals', type: 'signal', displayName: 'Reset single selected' },
    { name: 'resetMultipleSelected', group: 'Signals', type: 'signal', displayName: 'Reset multiple selected' },
    { name: 'tableSearching', group: 'States', type: 'boolean', displayName: 'Searching', default: false },
] as const satisfies readonly NodePort[];

export default table
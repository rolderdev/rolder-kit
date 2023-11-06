import { defaults } from "../defaults";
import { enums } from "../enums";
import { NodePort } from "../types";

const params = [
    { name: 'dbClass', group: 'Params', type: '*', displayName: 'Database class' },
    { name: 'subscribe', group: 'Params', type: 'boolean', displayName: 'Subscribe', default: false },
    { name: 'getUsers', group: 'Params', type: 'boolean', displayName: 'Get users', default: false },
    { name: 'optimistic', group: 'Params', type: 'boolean', displayName: 'Optimistic', default: false },
    { name: 'label', group: 'Params', type: 'string', displayName: 'Label' },
    { name: 'buttonType', group: 'Params', type: { name: 'enum', enums: enums.buttonTypes }, displayName: 'Button type', tooltip: '"Submit" to trigger form' },
    { name: 'notificationsPosition', group: 'Params', type: { name: 'enum', enums: enums.notificationsPositions }, displayName: 'Notifications position', default: 'bottom-right' },
    { name: 'placeholder', group: 'Params', type: 'string', displayName: 'Placeholder' },
    { name: 'debounced', group: 'Params', type: 'boolean', displayName: 'Debounced', default: false, tooltip: 'Delay typed value' },
    { name: 'delay', group: 'Params', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: [{ name: 'debounced', value: true }] },
    { name: 'modalHeaderEnabled', group: 'Params', type: 'boolean', displayName: 'Header', default: false },
    { name: 'modalTitle', group: 'Params', type: 'string', displayName: 'Modal title', dependsOn: [{ name: 'modalHeaderEnabled', value: true }] },
    { name: 'closeActionEnabled', group: 'Params', type: 'boolean', displayName: 'Enable close action', default: false, dependsOn: [{ name: 'modalHeaderEnabled', value: true }] },
    { name: 'drawerHeaderEnabled', group: 'Params', type: 'boolean', displayName: 'Header', default: false },
    { name: 'drawerTitle', group: 'Params', type: 'string', displayName: 'Drawer title', dependsOn: [{ name: 'drawerHeaderEnabled', value: true }] },
    { name: 'debouncedTyping', group: 'Params', type: 'boolean', displayName: 'Debounced', default: false, tooltip: 'Delay typed value' },
    { name: 'typingDelay', group: 'Params', type: 'number', displayName: 'Delay (ms)', default: 350, dependsOn: [{ name: 'debouncedTyping', value: true }] },
    { name: 'xlsxColumns', group: 'Params', type: 'array', displayName: 'Columns', default: defaults['xlsxColumns'] },
    { name: 'fileName', group: 'Params', type: 'string', displayName: 'File name', default: 'file.xlsx' },
    { name: 'sheetName', group: 'Params', type: 'string', displayName: 'Sheet name' },
    { name: 'xlsxCompression', group: 'Params', type: 'boolean', displayName: 'Compression ', default: true },
] as const satisfies readonly NodePort[];

export default params
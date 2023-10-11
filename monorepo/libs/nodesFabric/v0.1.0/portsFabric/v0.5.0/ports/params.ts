import helpers from "../helpers";
import { enums } from "../enums";

const params = [    
    { name: 'getUsers', group: 'Params', type: 'boolean', displayName: 'Get users', default: false },
    { name: 'optimistic', group: 'Params', type: 'boolean', displayName: 'Optimistic', default: false },
    { name: 'label', group: 'Params', type: 'string', displayName: 'Label' },
    { name: 'description', group: 'Params', type: 'string', displayName: 'Description' },
    { name: 'buttonType', group: 'Params', type: { name: 'enum', enums: enums.buttonTypes }, displayName: 'Button type', tooltip: '"Submit" to trigger form' },
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
    { name: 'xlsxColumns', group: 'Params', type: 'array', displayName: 'Columns', default: helpers['xlsxColumns'] },
    { name: 'fileName', group: 'Params', type: 'string', displayName: 'File name', default: 'file.xlsx' },
    { name: 'sheetName', group: 'Params', type: 'string', displayName: 'Sheet name' },
    { name: 'xlsxCompression', group: 'Params', type: 'boolean', displayName: 'Compression', default: true },
    { name: 'connectKuzzle', group: 'Params', type: 'boolean', displayName: 'Connect Kuzzle', default: true },
    { name: 'userRole', group: 'Params', type: 'string', displayName: 'User role' },
    { name: 'trapFocus', group: 'Params', type: 'boolean', displayName: 'Trap focus', default: true },
    { name: 'returnFocus', group: 'Params', type: 'boolean', displayName: 'Return focus', default: true },
    { name: 'closeOnEscape', group: 'Params', type: 'boolean', displayName: 'Close on escape', default: false },
    { name: 'closeOnClickOutside', group: 'Params', type: 'boolean', displayName: 'Close on click outside', default: false },
    { name: 'searchable', group: 'Params', type: 'boolean', displayName: 'Searchable', default: true },
    { name: 'clearable', group: 'Params', type: 'boolean', displayName: 'Clearable', default: true },
    { name: 'creatable', group: 'Params', type: 'boolean', displayName: 'Creatable', default: false },
    { name: 'labelField', group: 'Params', type: 'string', displayName: 'Label field', default: 'label' },
    { name: 'dateFormat', group: 'Params', type: 'string', displayName: 'Date format', default: 'projectDefault' },
    { name: 'limitMinDate', group: 'Params', type: 'boolean', displayName: 'Limit min date', default: false },
    { name: 'minDateOffset', group: 'Params', type: 'number', displayName: 'Min date offset', default: 0, dependsOn: [{ name: 'limitMinDate', value: true }] },
] as const satisfies readonly NodePort[];

export default params
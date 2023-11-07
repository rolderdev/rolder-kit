import { enums } from "../enums";

const font = [
    { name: 'modalTitleOrder', group: 'Font', type: 'number', displayName: 'Order', default: 4, tooltip: '1 - 6', dependsOn: [{ name: 'modalHeaderEnabled', value: true }] },
    { name: 'drawerTitleOrder', group: 'Font', type: 'number', displayName: 'Order', default: 4, tooltip: '1 - 6', dependsOn: [{ name: 'drawerHeaderEnabled', value: true }] },
    { name: 'checkBoxFz', group: 'Checkbox', type: { name: 'enum', enums: enums.sizes }, displayName: 'Font size', default: 'sm' },
    { name: 'fz', group: 'Font', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'md' },
    { name: 'fw', group: 'Font', type: { name: 'enum', enums: enums.fontWeights }, displayName: 'Weight', default: '400' },
    { name: 'ta', group: 'Layout', type: { name: 'enum', enums: enums.textAligns }, displayName: 'Align', default: 'left' },
    { name: 'titleOrder', group: 'Font', type: 'number', displayName: 'Order', tooltip: '1 - 6', default: 3 },
] as const satisfies readonly NodePort[];

export default font
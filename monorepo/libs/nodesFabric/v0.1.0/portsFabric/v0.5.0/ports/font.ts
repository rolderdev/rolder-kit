import { enums } from "../enums";

const font = [
    { name: 'modalTitleOrder', group: 'Font', type: 'number', displayName: 'Order', default: 4, tooltip: '1 - 6', dependsOn: [{ name: 'modalHeaderEnabled', value: true }] },
    { name: 'drawerTitleOrder', group: 'Font', type: 'number', displayName: 'Order', default: 4, tooltip: '1 - 6', dependsOn: [{ name: 'drawerHeaderEnabled', value: true }] },
    { name: 'checkBoxFz', group: 'Checkbox', type: { name: 'enum', enums: enums.sizes }, displayName: 'Font size', default: 'sm' },
] as const satisfies readonly NodePort[];

export default font
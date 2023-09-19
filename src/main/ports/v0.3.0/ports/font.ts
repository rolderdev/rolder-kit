import { NodePort } from "../types";

const font = [
    { name: 'modalTitleOrder', group: 'Font', type: 'number', displayName: 'Order', default: 4, tooltip: '1 - 6', dependsOn: { name: 'modalHeaderEnabled', value: true } },
    { name: 'drawerTitleOrder', group: 'Font', type: 'number', displayName: 'Order', default: 4, tooltip: '1 - 6', dependsOn: { name: 'drawerHeaderEnabled', value: true } },
] as const satisfies readonly NodePort[];

export default font
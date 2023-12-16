import { enums } from "../enums";
import { NodePort } from "../types";

const paddings = [
    { name: 'paddings', group: 'Paddings', type: 'boolean', displayName: 'Paddings', default: false },
    { name: 'p', group: 'Paddings', type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding', dependsOn: { name: 'paddings', value: true } },
    { name: 'px', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding x-axis', dependsOn: { name: 'paddings', value: true } },
    { name: 'py', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding y-axis', dependsOn: { name: 'paddings', value: true } },
    { name: 'pt', group: 'Paddings', type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding top', dependsOn: { name: 'paddings', value: true } },
    { name: 'pr', group: 'Paddings', type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding right', dependsOn: { name: 'paddings', value: true } },
    { name: 'pb', group: 'Paddings', type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding bottom', dependsOn: { name: 'paddings', value: true } },
    { name: 'pl', group: 'Paddings', type: { name: 'enum', enums: enums.sizes }, displayName: 'Padding left', dependsOn: { name: 'paddings', value: true } },
] as const satisfies readonly NodePort[];

export default paddings
import { enums } from "../enums";
import { NodePort } from "../types";

const margins = [
    { name: 'margins', group: 'Margins', type: 'boolean', displayName: 'Margins' },
    { name: 'm', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin', dependsOn: [{ name: 'margins', value: true }] },
    { name: 'mx', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin x-axis', dependsOn: [{ name: 'margins', value: true }] },
    { name: 'my', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin y-axis', dependsOn: [{ name: 'margins', value: true }] },
    { name: 'mt', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin top', dependsOn: [{ name: 'margins', value: true }] },
    { name: 'mr', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin right', dependsOn: [{ name: 'margins', value: true }] },
    { name: 'mb', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin bottom', dependsOn: [{ name: 'margins', value: true }] },
    { name: 'ml', group: 'Margins', type: { name: 'enum', enums: enums.sizes }, displayName: 'Margin left', dependsOn: [{ name: 'margins', value: true }] },
] as const satisfies readonly NodePort[];

export default margins
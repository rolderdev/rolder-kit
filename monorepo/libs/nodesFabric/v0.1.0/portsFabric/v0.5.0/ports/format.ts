import { NodePort } from "../../../types";
import { enums } from "../enums";

const format = [
    { name: 'maskType', group: 'Mask', type: { name: 'enum', enums: enums.maskTypes }, displayName: 'Type', default: 'pattern' },
    { name: 'mask', group: 'Mask params', type: 'string', displayName: 'Mask', default: '{8} (000) 000-00-00', tooltip: "IMask js lib mask" },
    { name: 'hideMask', group: 'Mask params', type: 'boolean', displayName: 'Hide mask', default: false },
    { name: 'overwrite', group: 'Mask params', type: 'boolean', displayName: 'Overwrite', default: true },
    { name: 'maskPattern', group: 'Mask params', type: 'string', displayName: 'Pattern', default: '{8} (000) 000-00-00', dependsOn: [{ name: 'maskType', value: 'pattern' }], tooltip: "IMask js lib pattern mask" },
    { name: 'hideMaskPattern', group: 'Mask params', type: 'boolean', displayName: 'Hide', default: false, dependsOn: [{ name: 'maskType', value: 'pattern' }] },
    { name: 'overwriteMaskPattern', group: 'Mask params', type: 'boolean', displayName: 'Overwrite', default: true, dependsOn: [{ name: 'maskType', value: 'pattern' }] },
    { name: 'thousandsSeparator', group: 'Mask params', type: 'string', displayName: 'Thousands separator', default: ' ', dependsOn: [{ name: 'maskType', value: 'number' }] },
    { name: 'radix', group: 'Mask params', type: 'string', displayName: 'Radix', default: '.', dependsOn: [{ name: 'maskType', value: 'number' }] },
    { name: 'numberScale', group: 'Mask params', type: 'number', displayName: 'Scale', default: 2, dependsOn: [{ name: 'maskType', value: 'number' }] },
] as const satisfies readonly NodePort[];

export default format
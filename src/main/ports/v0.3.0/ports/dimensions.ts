import { enums } from "../enums";
import { NodePort } from "../types";
const units = ['rem', '%', 'px']

const dimensions = [
    { name: 'size', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'sm' },
    { name: 'w', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width' },
    { name: 'h', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Height' },
    { name: 'sizePresets', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'sm' },
    { name: 'sizeString', group: 'Dimensions', type: 'string', displayName: 'Size (string)' },
    { name: 'sizeUnits', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Size (units)' },
] as const satisfies readonly NodePort[];

export default dimensions
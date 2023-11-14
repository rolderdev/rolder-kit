import { enums } from "../enums";
const units = ['rem', '%', 'px']

const dimensions = [
    { name: 'size', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'sm' },
    { name: 'w', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Width' },
    { name: 'h', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Height' },
    { name: 'sizePresets', group: 'Dimensions', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'sm' },
    { name: 'sizeString', group: 'Dimensions', type: 'string', displayName: 'Size (string)' },
    { name: 'sizeUnits', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Size (units)' },
    { name: 'loaderSize', group: 'Loader', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'md' },
    { name: 'appLoaderSize', group: 'Loader', type: { name: 'enum', enums: enums.sizes }, displayName: 'Size', default: 'xl' },
    { name: 'maxDropdownHeight', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Max dropdown height' },
    { name: 'fullWidth', group: 'Dimensions', type: 'boolean', displayName: 'Full width' },
    { name: 'fitContent', group: 'Dimensions', type: 'boolean', displayName: 'Fit content', default: false },
    { name: 'barLoaderWidth', group: 'Dimensions', type: { name: 'number', units, defaultUnit: '%' }, displayName: 'Width', default: '100%' },
    { name: 'maw', group: 'Dimensions', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Max width' },
] as const satisfies readonly NodePort[];

export default dimensions
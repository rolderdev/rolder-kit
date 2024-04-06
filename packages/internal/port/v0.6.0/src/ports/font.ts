import { type NodePort } from "../../types";
import { enums } from "../collections/enums";
import { getCustomEnumType, getEnumType } from "../funcs/getType";

const weights = [{ value: '400', label: 'Normal' }, { value: '600', label: 'Medium' }, { value: '700', label: 'Bold' }]

export default [
    {
        name: 'fz', group: 'Font', type: getEnumType(enums.sizes), displayName: 'Size', default: 'md',
        customs: { required: 'connection' }
    },
    {
        name: 'fw', group: 'Font', type: getEnumType(weights), displayName: 'Weight', default: '400',
        customs: { required: 'connection' }
    },
    {
        name: 'ta', group: 'Layout', type: getCustomEnumType(['left', 'center', 'right']), displayName: 'Align', default: 'left',
        customs: { required: 'connection' }
    },
    { name: 'highlight', group: 'Highlight', type: 'array', displayName: 'Highlight' },
    { name: 'highlightColor', group: 'Highlight', type: 'string', displayName: 'Color' },
    { name: 'highlightStyles', group: 'Highlight', type: 'array', displayName: 'Styles', customs: { isObject: true } },
    { name: 'inline', group: 'Layout', type: 'boolean', displayName: 'Inline', default: false },
    { name: 'fitContent', group: 'Dimensions', type: 'boolean', displayName: 'Fit content', default: false },
    {
        name: 'textFormat', group: 'Params', type: getCustomEnumType(['none', 'number', 'date', 'mask']),
        displayName: 'Text format', default: 'none'
    },
    {
        name: 'textMask', group: 'Params', type: 'string', displayName: 'Mask', default: '{8} (000) 000-00-00',
        customs: { dependsOn(p) { return p.textFormat === 'mask' }, required: 'both' }
    },
    {
        name: 'numberFormat', group: 'Params', type: 'array', displayName: 'Number format',
        customs: { dependsOn(p) { return p.textFormat === 'number' }, required: 'both', isObject: true }
    }
] as const satisfies readonly NodePort[]
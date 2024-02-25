import { NodePort } from "../../port";
import { defaultUnits, getEnumType, getUnitType } from "../funcs/getType";
import { enums } from "../collections/enums";

export default [
    { name: 'maw', displayName: 'Max width', group: 'Dimensions', type: getUnitType(defaultUnits, '%') },
    { name: 'w', displayName: 'Width', group: 'Dimensions', type: getUnitType(defaultUnits, '%') },
    //{ name: 'w100', displayName: 'Width', group: 'Dimensions', type: getUnitType(defaultUnits, '%'), default: 100 },
    { name: 'h', displayName: 'Height', group: 'Dimensions', type: getUnitType(defaultUnits, '%') },
    { name: 'height', displayName: 'Height', group: 'Dimensions', type: getUnitType(defaultUnits, 'px') },
    { name: 'maxDropdownHeight', displayName: 'Max dropdown height', group: 'Dimensions', type: getUnitType(defaultUnits, 'rem') },
    { name: 'size', displayName: 'Size', group: 'Dimensions', type: getEnumType(enums.sizes), default: 'sm' },
    { name: 'fullWidth', displayName: 'Full width', group: 'Dimensions', type: 'boolean', default: false },
    { name: 'grow', displayName: 'Grow', group: 'Dimensions', type: 'boolean', default: false },
    // Margins
    { name: 'margins', displayName: 'Margins', group: 'Margins', type: 'boolean', default: false },
    {
        name: 'm', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Margins',
        customs: { dependsOn(p) { return p.margins ? true : false }, }
    },
    {
        name: 'mx', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Margin x-axis',
        customs: { dependsOn(p) { return p.margins ? true : false }, }
    },
    {
        name: 'my', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Margin y-axis',
        customs: { dependsOn(p) { return p.margins ? true : false }, }
    },
    {
        name: 'mt', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Margin top',
        customs: { dependsOn(p) { return p.margins ? true : false }, }
    },
    {
        name: 'mr', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Margin right',
        customs: { dependsOn(p) { return p.margins ? true : false }, }
    },
    {
        name: 'mb', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Margin bottom',
        customs: { dependsOn(p) { return p.margins ? true : false }, }
    },
    {
        name: 'ml', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Margin left',
        customs: { dependsOn(p) { return p.margins ? true : false }, }
    },
    // Paddings
    { name: 'paddings', group: 'Paddings', type: 'boolean', displayName: 'Paddings', default: false },
    {
        name: 'p', group: 'Paddings', type: getEnumType(enums.sizes), displayName: 'Padding',
        customs: { dependsOn(p) { return p.paddings ? true : false }, }
    },
    {
        name: 'px', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Padding x-axis',
        customs: { dependsOn(p) { return p.paddings ? true : false }, }
    },
    {
        name: 'py', group: 'Margins', type: getEnumType(enums.sizes), displayName: 'Padding y-axis',
        customs: { dependsOn(p) { return p.paddings ? true : false }, }
    },
    {
        name: 'pt', group: 'Paddings', type: getEnumType(enums.sizes), displayName: 'Padding top',
        customs: { dependsOn(p) { return p.paddings ? true : false }, }
    },
    {
        name: 'pr', group: 'Paddings', type: getEnumType(enums.sizes), displayName: 'Padding right',
        customs: { dependsOn(p) { return p.paddings ? true : false }, }
    },
    {
        name: 'pb', group: 'Paddings', type: getEnumType(enums.sizes), displayName: 'Padding bottom',
        customs: { dependsOn(p) { return p.paddings ? true : false }, }
    },
    {
        name: 'pl', group: 'Paddings', type: getEnumType(enums.sizes), displayName: 'Padding left',
        customs: { dependsOn(p) { return p.paddings ? true : false }, }
    },
] as const satisfies readonly NodePort[]
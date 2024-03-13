import { enums } from "../enums";
const units = ['rem', '%', 'px']

const icon = [
    { name: 'iconType', group: 'Icon', type: { name: 'enum', enums: enums.iconTypes }, displayName: 'Type', default: 'icon' },
    { name: 'iconName', group: 'Icon', type: 'string', displayName: 'Icon name', tooltip: 'Find icon at tabler-icons.io and capitalize it: "IconSuperName"' },
    { name: 'iconSize', group: 'Icon', type: { name: 'number', units, defaultUnit: 'rem' }, displayName: 'Icon size' },
    { name: 'stroke', group: 'Icon', type: 'number', displayName: 'Stroke' },
    { name: 'iconColor', group: 'Icon', type: 'string', displayName: 'Icon color' },
    { name: 'themeIconVariant', group: 'Theme icon', type: { name: 'enum', enums: enums.themeIconVariants }, displayName: 'Variant', default: 'filled', dependsOn: [{ name: 'iconType', value: 'themeIcon' }] },
    { name: 'themeIconSize', group: 'Theme icon', type: { name: 'enum', enums: enums.sizes }, displayName: 'Theme icon size', default: 'md', dependsOn: [{ name: 'iconType', value: 'themeIcon' }] },
    { name: 'themeIconRadius', group: 'Theme icon', type: { name: 'enum', enums: enums.sizes }, displayName: 'Radius', default: 'sm', dependsOn: [{ name: 'iconType', value: 'themeIcon' }] },
    { name: 'themeIconColor', group: 'Theme icon', type: 'string', displayName: 'Theme icon color', dependsOn: [{ name: 'iconType', value: 'themeIcon' }] },
    { name: 'themeIconGradient', group: 'Theme icon', type: 'array', displayName: 'Gradient', isObject: true, dependsOn: [{ name: 'iconType', value: 'themeIcon' }, { name: 'themeIconVariant', value: 'gradient' }] },
] as const satisfies readonly NodePort[];

export default icon
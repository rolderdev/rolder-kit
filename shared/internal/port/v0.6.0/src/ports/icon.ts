import { NodePort } from "../../types";
import { enums } from "../collections/enums";
import { defaultUnits, getCustomEnumType, getEnumType, getUnitType } from "../funcs/getType";

export default [
    {
        name: 'iconName', displayName: 'Icon name', group: 'Params', type: 'string',
        customs: {
            validate(p) {
                return p.iconName
                    ? R.libs.icons[p.iconName] ? true : `There is no "${p.iconName}" at Rolder Kit`
                    : true
            }
        }
    },
    {
        name: 'iconType', group: 'Params', type: getCustomEnumType(['icon', 'themeIcon']),
        displayName: 'Type', default: 'icon', customs: { required: 'both' }
    },
    {
        name: 'iconSize', displayName: 'Icon size', group: 'Dimensions',
        type: getUnitType(defaultUnits, 'px'), default: 24,
        customs: {
            required: 'both',
            dependsOn(p) {
                return p.iconType
                    ? p.iconType === 'icon' && p.iconName
                    : p.iconName ? true : false
            }
        }
    },
    {
        name: 'iconStroke', displayName: 'Stroke', group: 'Style', type: 'number', default: 2,
        customs: {
            required: 'both',
            dependsOn(p) {
                return p.iconType
                    ? p.iconType === 'icon' && p.iconName
                    : p.iconName ? true : false
            }
        }
    },
    {
        name: 'iconColor', displayName: 'Icon color', group: 'Style', type: 'string',
        customs: {
            dependsOn(p) {
                return p.iconType
                    ? p.iconType === 'icon' && p.iconName
                    : p.iconName ? true : false
            }
        }
    },
    {
        name: 'themeIconVariant', group: 'Theme icon', displayName: 'Variant', default: 'filled',
        type: getCustomEnumType(['filled', 'light', 'gradient', 'outline', 'default']),
        customs: { required: 'both', dependsOn(p) { return p.iconType === 'themeIcon' && p.iconName } }
    },
    {
        name: 'themeIconSize', group: 'Theme icon', type: getEnumType(enums.sizes),
        displayName: 'Theme icon size', default: 'md',
        customs: { required: 'both', dependsOn(p) { return p.iconType === 'themeIcon' && p.iconName } }
    },
    {
        name: 'themeIconRadius', group: 'Theme icon', type: getEnumType(enums.sizes),
        displayName: 'Radius', default: 'sm',
        customs: { required: 'both', dependsOn(p) { return p.iconType === 'themeIcon' && p.iconName } }
    },
    {
        name: 'themeIconColor', group: 'Theme icon', type: 'string', displayName: 'Theme icon color',
        customs: { dependsOn(p) { return p.iconType === 'themeIcon' && p.iconName } }
    },
    {
        name: 'themeIconGradient', group: 'Theme icon', type: 'array', displayName: 'Gradient',
        customs: {
            required: 'both', isObject: true, dependsOn(p) {
                return p.iconType === 'themeIcon' && p.iconName && p.themeIconVariant === 'gradient'
            }
        }
    },
] as const satisfies readonly NodePort[];
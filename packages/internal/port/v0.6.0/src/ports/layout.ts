import { type NodePort } from "../../types";
import { enums } from "../collections/enums";
import { getCustomEnumType, getEnumType } from "../funcs/getType";

export default [
    {
        name: 'dropdownPosition', displayName: 'Position', group: 'Layout',
        type: getCustomEnumType(['flip', 'bottom', 'top']), default: 'flip'
    },
    { name: 'autosize', displayName: 'Autosize', group: 'Layout', type: 'boolean', default: false },
    { name: 'minRows', displayName: 'Min rows', group: 'Layout', type: 'number', default: 2 },
    {
        name: 'maxRows', displayName: 'Max rows', group: 'Layout', type: 'number',
        customs: { dependsOn(p) { return p.autosize ? true : false } }
    },
    {
        name: 'dropdownType', displayName: 'Dropdown type', group: 'Layout', default: 'popover',
        type: getCustomEnumType(['popover', 'modal', 'multiple'])
    },
    { name: 'spacing', displayName: 'Spacing', group: 'Layout', type: getEnumType(enums.sizes), default: 'md' },
    { name: 'grow', displayName: 'Grow', group: 'Layout', type: 'boolean', default: false },
    { name: 'noWrap', displayName: 'No wrap', group: 'Layout', type: 'boolean', default: false },
] as const satisfies readonly NodePort[]
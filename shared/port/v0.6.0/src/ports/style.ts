import { enums } from "../collections/enums";
import { getEnumType } from "../funcs/getType";
import { NodePort } from "../../types";

export default [
    { name: 'radius', displayName: 'Radius', group: 'Style', type: getEnumType(enums.sizes), default: 'md' },
    { name: 'withAsterisk', displayName: 'With asterisk', group: 'Style', type: 'boolean', default: false },
    { name: 'stroke', displayName: 'Stroke', group: 'Style', type: 'number', default: 1.25 },
    { name: 'iconColor', displayName: 'Icon color', group: 'Style', type: 'string' },
] as const satisfies readonly NodePort[]
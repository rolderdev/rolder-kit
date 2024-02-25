import { enums } from "../collections/enums";
import { getEnumType } from "../funcs/getType";
import { NodePort } from "../../types";

export default [
    { name: 'radius', displayName: 'Radius', group: 'Style', type: getEnumType(enums.sizes), default: 'md' },
    { name: 'withAsterisk', displayName: 'With asterisk', group: 'Style', type: 'boolean', default: false },
    { name: 'backgroundColor', displayName: 'Bg color', group: 'Style', type: 'string' },
    { name: 'color', displayName: 'Color', group: 'Style', type: 'string' },
    { name: 'opacity', displayName: 'Opacity', group: 'Style', type: 'number', default: 1 },
] as const satisfies readonly NodePort[]
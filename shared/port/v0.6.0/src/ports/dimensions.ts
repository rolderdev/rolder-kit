import { NodePort } from "../../port";
import { defaultUnits, getUnitType } from "../funcs/getType";

export default [
    { name: 'width', displayName: 'Width', group: 'Dimensions', type: getUnitType(defaultUnits, '%'), default: 100 },
    { name: 'height', displayName: 'Height', group: 'Dimensions', type: getUnitType(defaultUnits, 'px') },
    { name: 'maw', displayName: 'Max width', group: 'Dimensions', type: getUnitType(defaultUnits, '%'), default: 100 },
] as const satisfies readonly NodePort[]
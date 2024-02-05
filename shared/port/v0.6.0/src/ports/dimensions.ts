import { NodePort } from "../../port";
import { defaultUnits, getUnitType } from "../funcs/getType";

export default [
    { name: 'maw', displayName: 'Max width', group: 'Dimensions', type: getUnitType(defaultUnits, '%') },
    { name: 'w', displayName: 'Width', group: 'Dimensions', type: getUnitType(defaultUnits, '%'), default: 100 },    
    { name: 'height', displayName: 'Height', group: 'Dimensions', type: getUnitType(defaultUnits, 'px') },
    { name: 'iconSize', displayName: 'Icon size', group: 'Dimensions', type: getUnitType(defaultUnits, 'px'), default: 24 },
] as const satisfies readonly NodePort[]
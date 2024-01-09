import { enums } from "../enums/enums";
import { getEnumType } from "../funcs/getType";
import { NodePort } from "../../types";

export default [
    { name: 'radius', displayName: 'Radius', group: 'Style', type: getEnumType(enums.sizes) }
] as const satisfies readonly NodePort[]
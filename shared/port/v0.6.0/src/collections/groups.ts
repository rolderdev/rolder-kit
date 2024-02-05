import { NodePort } from "../../types";
import { getGroupedPorts } from "../funcs/getPort";

export const inputGroups = {
    Icon: getGroupedPorts('input', ['iconName', 'iconSize', 'stroke', 'iconColor'], 'Icon')
}
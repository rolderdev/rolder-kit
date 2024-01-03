import { NodePort } from "..";
import { getPort } from "../funcs/getPort";

export default {
    items: getPort('items', 'Items', 'Data', 'array')
} as { [portName: string]: NodePort }
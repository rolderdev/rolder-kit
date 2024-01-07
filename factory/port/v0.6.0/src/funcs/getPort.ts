import clone from "just-clone";
import { NodePort } from "../../types";
import data from "../ports/data";
import style from "../ports/style";

export const ports = [...data, ...style]
export type PortName = typeof ports[number]['name']

export function getPort<Type extends NodePort>(nodePort: Type) {
    return { ...nodePort, tooltip: nodePort.name }
}

export function getPorts(plug: 'input' | 'output', portNames: PortName[], requiredEditorPorts?: PortName[]) {
    let resultPorts: NodePort[] = []
    portNames.forEach(portName => {
        const p = ports.find(i => i.name === portName)
        if (p) resultPorts.push(clone({
            ...p, plug, required: requiredEditorPorts?.includes(portName) ? 'editor' : undefined
        }))
    })
    return resultPorts
}
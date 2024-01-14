import clone from "just-clone";
import { NodePort } from "../../types";
import data from "../ports/data";
import style from "../ports/style";
import dimensions from "../ports/dimensions";
import advanced from "../ports/advanced";
import params from "../ports/params";
import states from "../ports/states";
import signals from "../ports/signals";

export const ports = [...advanced, ...data, ...style, ...dimensions, ...params, ...states, ...signals]
export type PortName = typeof ports[number]['name']

export function getPort<Type extends NodePort>(nodePort: Type) {
    let defaultValue = nodePort.default
    const md = nodePort.customs?.mantineDefault
    if (md) {
        const defaultProps = window.R.params.mantineTheme?.components[md.comp]?.defaultProps
        if (defaultProps && typeof defaultProps !== 'function') defaultValue = defaultProps?.[md.prop]
        else defaultValue = undefined
    }

    return { ...nodePort, default: defaultValue, tooltip: nodePort.name }
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
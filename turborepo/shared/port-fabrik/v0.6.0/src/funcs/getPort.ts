import clone from "just-clone";
import data from "../ports/data";
import { ExpandedType, PortType } from "./getType";
import { DependsOn, NodePort } from "../types";

type OutputPortName = 'qrDataUrl'
export type PortName = keyof typeof ports | OutputPortName
export type GroupName = 'Project' | 'Version' | 'Data' | 'Signals' | 'Params' | 'Style' | 'Loader'
export const ports = { ...data }

export function getPort(
    name: string,
    displayName: string,
    group: GroupName,
    type: PortType | ExpandedType,
    plug?: 'input' | 'output',    
    customs?: {
        required?: 'editor' | 'connection' | 'both',
        dependsOn?: DependsOn[],
        isObject?: boolean
    },
    defaultValue?: any,
    index?: number,
): NodePort {
    return { name, displayName, group, type, plug, default: defaultValue, index, tooltip: name, customs }
}

export function getPorts(plug: 'input' | 'output', portNames: PortName[], requiredEditorPorts?: PortName[]) {
    let resultPorts: NodePort[] = []
    portNames.forEach(portName => {
        const p = ports[portName]
        if (p) resultPorts.push(clone({ ...p, plug, required: requiredEditorPorts?.includes(portName) ? 'editor' : undefined }))
    })
    return resultPorts
}
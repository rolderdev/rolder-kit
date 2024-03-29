import { OutputName, PortName } from "@shared/port"
import { NoodlNode } from "@shared/node"

export function sendOutput(noodlNode: NoodlNode, portName: PortName | OutputName, value: any) {
    if (noodlNode?.hasOutput(portName as string)) {
        noodlNode.outputPropValues[portName] = value
        noodlNode.flagOutputDirty(portName as string)
    }
}
export function sendSignal(noodlNode: NoodlNode, portName: PortName | OutputName) {
    if (noodlNode?.hasOutput(portName as string)) setTimeout(() => noodlNode.sendSignalOnOutput(portName as string))
}
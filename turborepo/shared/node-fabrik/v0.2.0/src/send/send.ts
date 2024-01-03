import { PortName } from "@rk/port-fabrik"
import { NoodlNode } from ".."

export function sendOutput(noodlNode: NoodlNode, portName: PortName, value: any) {    
    if (noodlNode.hasOutput(portName as string)) {
        noodlNode.outputPropValues[portName] = value
        noodlNode.flagOutputDirty(portName as string)
    }
}
export function sendSignal(noodlNode: NoodlNode, portName: PortName) {
    if (noodlNode.hasOutput(portName as string)) setTimeout(() => noodlNode.sendSignalOnOutput(portName as string))
}
import { NodeInstance } from "../../../getNodes/v0.5.0/types"
import { PortNames } from "../../v0.3.0/get"

export function sendOutput(node: NodeInstance, portName: PortNames, value: any) {    
    if (node.hasOutput(portName)) {
        node.outputPropValues[portName] = value
        node.flagOutputDirty(portName)
    }
}
export function sendSignal(node: NodeInstance, portName: PortNames) {
    if (node.hasOutput(portName)) node.sendSignalOnOutput(portName)
}
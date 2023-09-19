import { NodeInstance } from "@noodl/noodl-sdk"
import { PortNames } from "../../../../main/ports/v0.3.0/get"

export function sendOutput(noodlNode: NodeInstance, portName: PortNames, value: any) {
    if (noodlNode.hasOutput(portName)) {
        noodlNode.outputPropValues[portName] = value
        noodlNode.flagOutputDirty(portName)
    }
}
export function sendSignal(noodlNode: NodeInstance, portName: PortNames) {
    if (noodlNode.hasOutput(portName)) noodlNode.sendSignalOnOutput(portName)
}
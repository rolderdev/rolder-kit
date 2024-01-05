import { PortNames } from "../../portsFabric/v0.5.0/get"

export function sendOutput(noodlNode: NoodlNode, portName: PortNames, value: any) {
    if (noodlNode.hasOutput(portName)) {
        noodlNode.outputPropValues[portName] = value
        noodlNode.flagOutputDirty(portName)
    }
}
export function sendSignal(noodlNode: NoodlNode, portName: PortNames) {    
    if (noodlNode.hasOutput(portName)) noodlNode.sendSignalOnOutput(portName)
}
import { NodeInstance } from "@noodl/noodl-sdk"

export function sendOutput(props: { noodlNode: NodeInstance, portName: string, value: any }) {
    const { noodlNode, portName, value } = props

    if (noodlNode.hasOutput(portName)) {
        noodlNode.outputPropValues[portName] = value
        noodlNode.flagOutputDirty(portName)
    }
}
export function sendSignal(props: { noodlNode: NodeInstance, portName: string }) {
    const { noodlNode, portName } = props
    if (noodlNode.hasOutput(portName)) noodlNode.sendSignalOnOutput(portName)
}
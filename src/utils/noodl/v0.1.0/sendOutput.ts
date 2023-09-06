import { NodeInstance } from "@noodl/noodl-sdk"

export default function sendOutput(props: { noodlNode: NodeInstance, portName: string, value: any }) {
    const { noodlNode, portName, value } = props

    if (noodlNode.hasOutput(portName)) {
        noodlNode.outputPropValues[portName] = value
        noodlNode.flagOutputDirty(portName)
    }
}
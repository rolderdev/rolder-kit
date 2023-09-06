import { NodeInstance } from "@noodl/noodl-sdk"

export default function sendSignal(props: { noodlNode: NodeInstance, portName: string }) {
    const { noodlNode, portName } = props
    if (noodlNode.hasOutput(portName)) noodlNode.sendSignalOnOutput(portName)
}
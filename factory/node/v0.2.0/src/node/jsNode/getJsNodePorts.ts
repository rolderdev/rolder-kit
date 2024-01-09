import { NodePort } from "@rk/port"
import { GraphModelNode, JsVersions, NodeContext } from "../../../types"
import getNodePorts from "../funcs/getNodePorts"

export default function (node: GraphModelNode, context: NodeContext, version: JsVersions) {
    let resultNodePorts: NodePort[] = []
    if (node.parameters?.version) {
        const inputs = version[node.parameters.version]?.inputs || []
        const outputs = version[node.parameters.version]?.outputs || []
        const allPorts = [...inputs, ...outputs]
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, context, allPorts, inputs))
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, context, allPorts, outputs))
    }
    return resultNodePorts
}
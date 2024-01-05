import { NodePort } from "@rk/port"
import { GraphModelNode, JsVersions, NodeContext } from "../../../types"
import getNodePorts from "../funcs/getNodePorts"

export default function (node: GraphModelNode, context: NodeContext, jsVersions: JsVersions) {
    let resultNodePorts: NodePort[] = []
    if (node.parameters?.version) {
        const inputs = jsVersions[node.parameters.version]?.inputs || []
        const outputs = jsVersions[node.parameters.version]?.outputs || []
        const allPorts = [...inputs, ...outputs]
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, context, allPorts, inputs))
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, context, allPorts, outputs))
    }
    return resultNodePorts
}
import { NodePort } from "@rk/port"
import { GraphModelNode, NodeContext, CompVersions } from "../../../types"
import getNodePorts from "../funcs/getNodePorts"

export default function (node: GraphModelNode, context: NodeContext, versions: CompVersions) {
    let resultNodePorts: NodePort[] = []
    if (node.parameters?.version) {
        const inputs = versions[node.parameters.version]?.inputs || []
        const outputs = versions[node.parameters.version]?.outputs || []        
        const allPorts = [...inputs, ...outputs]
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, context, allPorts, inputs))
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, context, allPorts, outputs))
    }
    return resultNodePorts
}
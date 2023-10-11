import getNodePorts from "./getNodePorts"

export default function (node: any, compVersions: CompVersions | JsVersions) {
    let resultNodePorts: NodePort[] = []
    if (node.parameters?.version) {
        const inputs = compVersions[node.parameters.version]?.inputs || []
        const outputs = compVersions[node.parameters.version]?.outputs || []
        const allPorts = [...inputs, ...outputs]
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, allPorts, inputs))
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, allPorts, outputs))
    }
    return resultNodePorts
}
import { customProps, propsFunction } from "../../../portsFabric/v0.5.0/get"
import getNodePorts from "./getNodePorts"

export default function (node: any, compVersions: CompVersions | JsVersions) {
    let resultNodePorts: NodePort[] = [window.R.libs.just.clone(customProps), window.R.libs.just.clone(propsFunction)]
    if (node.parameters?.version) {
        const inputs = compVersions[node.parameters.version]?.inputs || []
        const outputs = compVersions[node.parameters.version]?.outputs || []
        let signals = compVersions[node.parameters.version]?.signals || []
        const allPorts = [...inputs, ...outputs, ...signals]
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, allPorts, inputs))
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, allPorts, outputs))
        resultNodePorts = resultNodePorts.concat(getNodePorts(node, allPorts, signals))
    }
    return resultNodePorts
}
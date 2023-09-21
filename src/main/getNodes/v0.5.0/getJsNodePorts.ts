import typeOf from "just-typeof"
import { NodePort } from "../../ports/v0.3.0/types"
import checkDependsOn from "./checkDependsOn"
import { CompVersions, JsVersions } from "./types"

function setPorts(node: any, allNodePorts: NodePort[], currentNodePorts: NodePort[]) {
    const resultNodePorts: NodePort[] = []

    currentNodePorts.forEach(nodePort => {
        switch (nodePort.name) {
            // customs
            case 'dbClass': {
                nodePort.type = {
                    name: 'enum',
                    enums: Object.keys(eval(window.Noodl.getProjectSettings().dbClasses)[0]).map(i => ({ value: i, label: i }))
                }
                resultNodePorts.push(nodePort)
            } break
            default: {
                const isDependent = nodePort.dependsOn
                // first set it self, if it is not dependent
                if (!isDependent) resultNodePorts.push(nodePort)
                // then set it, if dependOn is meet condition                
                if (isDependent) {
                    // if we have several conditions
                    if (Array.isArray(nodePort.dependsOn)) {
                        let conditionIsTrueCount = 0
                        nodePort.dependsOn.forEach(dependsOn => {
                            if (checkDependsOn(dependsOn, allNodePorts, node.parameters)) conditionIsTrueCount++
                        })
                        if (conditionIsTrueCount === nodePort.dependsOn.length) resultNodePorts.push(nodePort)
                    }
                    // only one condition
                    else if (checkDependsOn(nodePort.dependsOn, allNodePorts, node.parameters)) resultNodePorts.push(nodePort)
                }
            }
        }
    })
    return resultNodePorts
}

export default function (node: any, compVersions: CompVersions | JsVersions) {
    let resultNodePorts: NodePort[] = []
    if (node.parameters?.version) {
        const inputs = compVersions[node.parameters.version]?.inputs || []
        const outputs = compVersions[node.parameters.version]?.outputs || []
        const allPorts = [...inputs, ...outputs]
        resultNodePorts = resultNodePorts.concat(setPorts(node, allPorts, inputs))
        resultNodePorts = resultNodePorts.concat(setPorts(node, allPorts, outputs))
    }
    return resultNodePorts
}
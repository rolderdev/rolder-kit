import { NodePort } from "../../ports/v0.3.0/types"
import checkDependsOn from "./checkDependsOn"
import { NodeInstance } from "./types"
import { changeWarnings, sendWarnings } from "./warnings"

export default function (node: NodeInstance, nodeInputs: NodePort[]) {
    // take inputs without dependOn, then parse dependents
    nodeInputs.filter(i => i.required).forEach(nodeInput => {
        const isDependent = nodeInput.dependsOn
        // first set it self, if it is not dependent
        if (!isDependent) changeWarnings(node, 'requiered', nodeInput.displayName, node.resultInputs[nodeInput.name])
        // then set it, if dependOn is meet condition                
        if (isDependent) {
            // if we have several conditions
            if (Array.isArray(nodeInput.dependsOn)) {
                let conditionIsTrueCount = 0
                nodeInput.dependsOn.forEach(dependsOn => {
                    if (checkDependsOn(dependsOn, nodeInputs, node.resultInputs)) conditionIsTrueCount++
                })
                if (conditionIsTrueCount === nodeInput.dependsOn.length)
                    changeWarnings(node, 'requiered', nodeInput.displayName, node.resultInputs[nodeInput.name])
            }
            // only one condition
            else if (checkDependsOn(nodeInput.dependsOn, nodeInputs, node.resultInputs))
                changeWarnings(node, 'requiered', nodeInput.displayName, node.resultInputs[nodeInput.name])
        }
    })

    sendWarnings(node)
}
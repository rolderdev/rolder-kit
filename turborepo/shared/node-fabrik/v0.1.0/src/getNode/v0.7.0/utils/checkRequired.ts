import { NoodlNode } from "../../.."
import { NodePort } from "../../../types"
import checkDependsOn from "./checkDependsOn"
import { changeWarnings, sendWarnings } from "./warnings"

export default function (noodlNode: NoodlNode, nodeInputs: NodePort[]) {
    // take inputs without dependOn, then parse dependents
    nodeInputs.filter(i => i.required).forEach(nodeInput => {
        const isDependent = nodeInput.dependsOn
        // first set it self, if it is not dependent
        if (!isDependent) changeWarnings(noodlNode, 'required', nodeInput.displayName, noodlNode.resultProps[nodeInput.name])
        // then set it, if dependOn is meet condition                
        if (isDependent) {
            // if we have several conditions
            if (Array.isArray(nodeInput.dependsOn)) {
                let conditionIsTrueCount = 0
                nodeInput.dependsOn.forEach(dependsOn => {
                    if (checkDependsOn(dependsOn, nodeInputs, noodlNode.resultProps)) conditionIsTrueCount++
                })
                if (conditionIsTrueCount === nodeInput.dependsOn.length)
                    changeWarnings(noodlNode, 'required', nodeInput.displayName, noodlNode.resultProps[nodeInput.name])
            }
            // only one condition
            else if (checkDependsOn(nodeInput.dependsOn, nodeInputs, noodlNode.resultProps))
                changeWarnings(noodlNode, 'required', nodeInput.displayName, noodlNode.resultProps[nodeInput.name])
        }
    })

    sendWarnings(noodlNode)
}
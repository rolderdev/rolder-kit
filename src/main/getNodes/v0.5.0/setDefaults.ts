import { isNil } from "lodash"
import { NodePort } from "../../ports/v0.3.0/types"
import checkDependsOn from "./checkDependsOn"

export default function (node: NodeInstance, nodeInputs: NodePort[]) {
    function setDefault(nodeInput: NodePort, value: any) {
        // first set value if is nil and default in not nil (can be flase default)
        if (isNil(value) && !isNil(nodeInput.default)) node.resultInputs[nodeInput.name] = nodeInput.default
        // and delete it if value is nil and default is nil
        if (isNil(value) && isNil(nodeInput.default)) delete node.resultInputs[nodeInput.name]
    }

    nodeInputs.forEach(nodeInput => {
        const isDependent = nodeInput.dependsOn
        // first set it self, if it is not dependent
        if (!isDependent) setDefault(nodeInput, node.resultInputs[nodeInput.name])
        // then set it, if dependOn is meet condition                
        if (isDependent) {
            // if we have several conditions
            if (Array.isArray(nodeInput.dependsOn)) {
                let conditionIsTrueCount = 0
                nodeInput.dependsOn.forEach(dependsOn => {
                    if (checkDependsOn(dependsOn, nodeInputs, node.resultInputs)) conditionIsTrueCount++
                })
                if (conditionIsTrueCount === nodeInput.dependsOn.length) setDefault(nodeInput, node.resultInputs[nodeInput.name])
            }
            // only one condition
            else if (checkDependsOn(nodeInput.dependsOn, nodeInputs, node.resultInputs)) setDefault(nodeInput, node.resultInputs[nodeInput.name])
        }
    })
}
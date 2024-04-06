import isEmpty from "@packages/is-empty"
import checkDependsOn from "./checkDependsOn"

export default function (noodlNode: NoodlNode, nodeInputs: NodePort[]) {
    function setDefault(nodeInput: NodePort, value: any) {        
        // first set value if is nil and default in not nil (can be flase default)
        if (isEmpty(value) && !isEmpty(nodeInput.default)) noodlNode.resultProps[nodeInput.name] = nodeInput.default
        // and delete it if value is nil and default is nil
        if (isEmpty(value) && isEmpty(nodeInput.default)) delete noodlNode.resultProps[nodeInput.name]
    }

    nodeInputs.forEach(nodeInput => {
        const isDependent = nodeInput.dependsOn
        // first set it self, if it is not dependent
        if (!isDependent) setDefault(nodeInput, noodlNode.resultProps[nodeInput.name])
        // then set it, if dependOn is meet condition                
        if (isDependent) {
            // if we have several conditions
            if (Array.isArray(nodeInput.dependsOn)) {
                let conditionIsTrueCount = 0
                nodeInput.dependsOn.forEach(dependsOn => {
                    if (checkDependsOn(dependsOn, nodeInputs, noodlNode.resultProps)) conditionIsTrueCount++
                })
                if (conditionIsTrueCount === nodeInput.dependsOn.length) setDefault(nodeInput, noodlNode.resultProps[nodeInput.name])
            }
            // only one condition
            else if (checkDependsOn(nodeInput.dependsOn, nodeInputs, noodlNode.resultProps))
                setDefault(nodeInput, noodlNode.resultProps[nodeInput.name])
        }
    })
}
import { isNil } from "lodash";
import { NodePort } from "../../ports/v0.3.0/types";
import { NodeInstance } from "./types";

export default function (node: NodeInstance, nodeInputs: NodePort[], inputName: string, value: any) {
    const nodeInput: NodePort | undefined = nodeInputs.find(i => i.name === inputName)

    if (nodeInput) {
        // when this input changed        
        node.resultInputs[inputName] = value
        // change dependents inputs
        const dependents = nodeInputs.filter(i => i.dependsOn?.name === inputName)
        const enabledDependents = dependents.filter(i => i.dependsOn?.value === value)
        // when dependOn changed 
        if (enabledDependents.length) enabledDependents.forEach(i => {
            // restore dependent value
            if (!isNil(node._inputValues[i.name])) node.resultInputs[i.name] = node._inputValues[i.name]
        })
    }
}
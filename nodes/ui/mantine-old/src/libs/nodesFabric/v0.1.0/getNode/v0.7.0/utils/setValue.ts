import isEmpty from "@packages/is-empty"

export default function (noodlNode: NoodlNode, nodeInputs: NodePort[], inputName: string, value: any) {
    const nodeInput: NodePort | undefined = nodeInputs.find(i => i.name === inputName)

    if (nodeInput) {
        // when this input changed        
        noodlNode.resultProps[inputName] = value
        // change dependents inputs
        const dependents = nodeInputs.filter(i => i.dependsOn?.map(i => i.name).includes(inputName))
        const enabledDependents = dependents.filter(i => i.dependsOn?.map(i => i.value).includes(value))
        // when dependOn changed 
        if (enabledDependents.length) enabledDependents.forEach(i => {
            // restore dependent value
            if (!isEmpty(noodlNode._inputValues[i.name])) noodlNode.resultProps[i.name] = noodlNode._inputValues[i.name]
        })
    }
}
import checkDependsOn from "./checkDependsOn"

export default function (node: GraphModelNode, allNodePorts: NodePort[], currentNodePorts: NodePort[]) {
    const resultNodePorts: NodePort[] = []

    currentNodePorts.forEach((nodePort, idx) => {
        nodePort.index = 1000 + idx
        switch (nodePort.name) {
            // project defaults
            case 'dateFormat': {
                if (nodePort.default === 'projectDefault') {
                    // @ts-ignore
                    nodePort.default = window.Noodl.getProjectSettings().defaultDateFormat || 'YYYY-MM-DD'
                    resultNodePorts.push(nodePort)
                }
            } break
            // customs
            case 'dbClass': {
                nodePort.type = {
                    name: 'enum',
                    // @ts-ignore
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
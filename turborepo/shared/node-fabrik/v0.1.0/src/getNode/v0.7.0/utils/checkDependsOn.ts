import { NodePort } from "../../../types"

export default function checkDependsOn(dependsOn: any, allNodePorts: NodePort[], values: any) {
    if (dependsOn) {
        const dependsOnPort = allNodePorts.find(i => i.name === dependsOn?.name)
        if (dependsOnPort) {
            const dependsOnPortValue = values[dependsOnPort.name] || dependsOnPort.default
            const dependsOnValue = dependsOn.value
            if (dependsOnPortValue === dependsOnValue) return true
        }
    }
    return false
}
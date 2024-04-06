import { type NodePort } from '@packages/port'
import { type Props } from '../../types'

export function filterPortsByDependencies(allNodePorts: NodePort[], nodeProps: Props) {
    let resultNodePorts: NodePort[] = []
    
    allNodePorts.forEach(nodePort => {        
        if (nodePort.customs?.dependsOn) {            
            if (nodePort.customs.dependsOn(nodeProps)) resultNodePorts.push(nodePort)
        } else resultNodePorts.push(nodePort)
    })

    return resultNodePorts
}
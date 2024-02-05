import { NodePort } from '@shared/port'
import { GraphModelNode, NodeContext } from '../../types'
import { clearWarning, sendWarning } from "./warnings"

export function editorValidate(node: GraphModelNode, context: NodeContext, nodeInputs: NodePort[]) {
    let filteredInputs: NodePort[] = []
    nodeInputs.forEach(nodeInput => {
        if (nodeInput.customs?.dependsOn) {
            if (nodeInput.customs.dependsOn(node.nodeProps)) filteredInputs.push(nodeInput)
        } else filteredInputs.push(nodeInput)
    })

    filteredInputs?.filter(i => i.customs?.required && ['connection', 'both'].includes(i.customs?.required)).forEach(nodeInput => {
        const dn = nodeInput.displayName
        if (nodeInput.customs?.validate) {
            const validation = nodeInput.customs?.validate(node.nodeProps)
            if (typeof validation === 'string') sendWarning(node, context, dn, validation)
        } //else clearWarning(node, context, dn) // нужно подружить с required
    })
}
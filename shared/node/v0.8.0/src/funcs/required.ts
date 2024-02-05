import { NodePort } from '@shared/port'
import { GraphModelNode, NodeContext, NoodlNode } from '../../types'
import { clearWarning, sendWarning } from "./warnings"
import isEmpty from '@shared/is-empty'

export function editorRequired(node: GraphModelNode, context: NodeContext, nodeInputs: NodePort[]) {
    nodeInputs.filter(i => i.customs?.required && ['editor', 'both'].includes(i.customs?.required)).forEach(nodeInput => {
        const dn = nodeInput.displayName
        const p = node.nodeProps[nodeInput.name]

        if (isEmpty(p) && !nodeInput.default) sendWarning(node, context, dn, `Specify required input: "${dn}"`)
        else if (Array.isArray(p) && !p.length) sendWarning(node, context, dn, `Array is empty at input "${dn}"`)
        else clearWarning(node, context, dn)
    })
}

export function connectionRequired(noodlNode: NoodlNode, nodeInputs: NodePort[], props: any,) {
    let filteredInputs: NodePort[] = []
    nodeInputs.forEach(nodeInput => {
        if (nodeInput.customs?.dependsOn) {
            if (nodeInput.customs.dependsOn(props)) filteredInputs.push(nodeInput)
        } else filteredInputs.push(nodeInput)
    })

    filteredInputs?.filter(i => i.customs?.required && ['connection', 'both'].includes(i.customs?.required)).forEach(nodeInput => {
        const dn = nodeInput.displayName        
        if (isEmpty(props[nodeInput.name])) sendWarning(noodlNode.model, noodlNode.context, dn, `Empty input from connection: "${dn}"`)
        else clearWarning(noodlNode.model, noodlNode.context, dn)
    })
}
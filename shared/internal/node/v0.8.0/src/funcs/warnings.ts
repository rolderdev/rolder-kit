import { GraphModelNode, NodeContext, NoodlNode } from "../../types"

export function sendWarning(node: GraphModelNode, context: NodeContext, displayName: string, message: string) {
    context.editorConnection.sendWarning(node.component.name, node.id, displayName, { message, showGlobally: true })
}
export function clearWarning(node: GraphModelNode, context: NodeContext, displayName: string) {
    context.editorConnection.clearWarning(node.component.name, node.id, displayName)
}
export function hasWarings(noodlNode: NoodlNode) {
    const warnings: string[] = Array.from(noodlNode.context.editorConnection.activeWarnings?.currentWarnings?.keys())
    return warnings?.some(i => i === noodlNode.id)
}
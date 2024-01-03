import { GraphModelNode, NodeContext } from "../../types"

export function sendWarning(node: GraphModelNode, context: NodeContext, displayName: string, message: string) {
    context.editorConnection.sendWarning(node.component.name, node.id, displayName, { message, showGlobally: true })
}
export function clearWarning(node: GraphModelNode, context: NodeContext, displayName: string) {
    context.editorConnection.clearWarning(node.component.name, node.id, displayName)
}
export function getWarningsCount(context: NodeContext) { return context.editorConnection.activeWarnings.currentWarnings.size }
// Модель сообщения в редакторе.

import type { GraphModelNode, NodeContext } from '../../main';

export function sendWarning(model: GraphModelNode, context: NodeContext, displayName: string, message: string) {
	context.editorConnection.sendWarning(model.component.name, model.id, displayName, {
		message,
		showGlobally: true,
	});
}
export function clearWarning(model: GraphModelNode, context: NodeContext, displayName: string) {
	context.editorConnection.clearWarning(model.component.name, model.id, displayName);
}
export function hasWarnings(model: GraphModelNode, context: NodeContext) {
	const warnings: string[] = Array.from(context.editorConnection.activeWarnings?.currentWarnings?.keys());
	return warnings?.some((i) => i === model.id);
}

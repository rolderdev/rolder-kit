// Модель сообщения в редакторе.

import type { NoodlNode } from '../../types';

export function sendWarning(noodlNode: NoodlNode, displayName: string, message: string) {
	if (noodlNode.model)
		noodlNode.context.editorConnection.sendWarning(noodlNode.model.component.name, noodlNode.id, displayName, {
			message,
			showGlobally: true,
		});
}
export function clearWarning(noodlNode: NoodlNode, displayName: string) {
	if (noodlNode.model) noodlNode.context.editorConnection.clearWarning(noodlNode.model.component.name, noodlNode.id, displayName);
}
export function hasWarings(noodlNode: NoodlNode) {
	const warnings: string[] = Array.from(noodlNode.context.editorConnection.activeWarnings?.currentWarnings?.keys());
	return warnings?.some((i) => i === noodlNode.id);
}

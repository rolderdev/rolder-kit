// Модель сообщения в редакторе.

// Нужна своя структура, т.к. нужно отличать разные типы ошибок.
//export type InputWarnings = Record<WarningType, string>; // string - сообщение об ошибке.
export type Warnings = Map<string, WarningType>; // string - displayName инпута.
type WarningType = 'convert' | 'type' | 'value' | 'global';

import type { GraphModelNode, NodeContext } from '../../main';

export function sendWarning(
	model: GraphModelNode,
	context: NodeContext,
	type: WarningType,
	displayName: string,
	message: string
) {
	// Не страшно, что может уже быть другой тип. Все сделано так, что при любой ошибке процесс останавливается, значит перезаписи не будет.
	model.warnings.set(displayName, type);

	context.editorConnection.sendWarning(model.component.name, model.id, displayName, {
		message,
		showGlobally: true,
	});
}

export function clearWarning(model: GraphModelNode, context: NodeContext, type: WarningType, displayName: string) {
	// Если типизирован, удаляем только если тип совпадает. Это нужно, чтобы проверки других типов не удаляли не свое.
	if (model.warnings.get(displayName) === type) {
		model.warnings.delete(displayName);
		context.editorConnection.clearWarning(model.component.name, model.id, displayName);
	}
}

export const hasWarnings = (model: GraphModelNode, type?: WarningType) => {
	if (!type) return model.warnings.size > 0;
	else return Array.from(model.warnings.values()).filter((i) => i === type).length > 0;
};

import type { GraphModelNode, JsNodeVersions, NodeContext, ReactNodeVersions } from '../../main';
import { clearWarning, sendWarning } from './warning';

// Валидация всей ноды в начале.
export const validateBeforNode = async (
	model: GraphModelNode,
	context: NodeContext,
	versions: JsNodeVersions | ReactNodeVersions
) => {
	const nodeDef = versions[model.parameters.version];
	if (nodeDef.beforeNode?.validate) {
		const validateResult = await nodeDef.beforeNode.validate(model);
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string') sendWarning(model, context, 'globalBefore', 'globalBefore', validateResult);
		else if (validateResult === false) sendWarning(model, context, 'globalBefore', 'globalBefore', 'Node validation failed.');
		// Сброс ошибки
		else if (validateResult === true) clearWarning(model, context, 'globalBefore', 'globalBefore');
	}
};

// Валидация всей ноды в конце.
export const validateAfterNode = async (
	model: GraphModelNode,
	context: NodeContext,
	versions: JsNodeVersions | ReactNodeVersions
) => {
	const nodeDef = versions[model.parameters.version];
	if (nodeDef.afterNode?.validate) {
		const validateResult = await nodeDef.afterNode.validate(model.parametersCache, model);
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string') sendWarning(model, context, 'globalAfter', 'globalAfter', validateResult);
		else if (validateResult === false) sendWarning(model, context, 'globalAfter', 'globalAfter', 'Node validation failed.');
		// Сброс ошибки
		if (validateResult === true) clearWarning(model, context, 'globalAfter', 'globalAfter');
	}
};

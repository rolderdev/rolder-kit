import type { GraphModelNode, JsNodeVersions, NodeContext, ReactNodeVersions } from '../../main';
import { clearWarning, sendWarning } from './warning';

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

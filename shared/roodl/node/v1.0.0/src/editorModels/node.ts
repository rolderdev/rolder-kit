import type { GraphModelNode, JsNodeVersions, NodeContext, ReactNodeVersions } from '../../main';
import { clearWarning, sendWarning } from './warning';

// Валидация всей ноды.
export const validateNode = async (model: GraphModelNode, context: NodeContext, versions: JsNodeVersions | ReactNodeVersions) => {
	const nodeDef = versions[model.parameters.version];
	if (nodeDef.validate) {
		const validateResult = await nodeDef.validate(model.parametersCache, model);
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string') sendWarning(model, context, 'global', 'global', validateResult);
		// Сброс ошибки
		if (validateResult === true) clearWarning(model, context, 'global', 'global');
	}
};

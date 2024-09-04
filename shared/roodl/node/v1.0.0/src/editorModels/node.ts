import type { GraphModelNode, JsNodeVersions, NodeContext, ReactNodeVersions } from '../../main';
import { sendWarning } from './warning';

// Валидация всей ноды.
export const validateNode = async (model: GraphModelNode, context: NodeContext, versions: JsNodeVersions | ReactNodeVersions) => {
	const nodeDef = versions[model.parameters.version];
	if (nodeDef.validate) {
		const validateResult = await nodeDef.validate(model.parametersCache, model);
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string') sendWarning(model, context, '', validateResult);
		// Сброс ошибки
		if (validateResult === true) context.editorConnection.clearWarnings(model.component.name, model.id);
	}
};

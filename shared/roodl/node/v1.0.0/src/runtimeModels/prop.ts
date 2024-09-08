import type { PortDef } from '@shared/port-v1.0.0';
import type { NodeDef, NoodlNode } from '../../main';
import { clearWarning, sendWarning } from '../editorModels/warning';

// Установка дефолтных значений для props, т.к. в  runtime дефолты с редактора не применяются.
export const setPropDeafaults = (noodlNode: NoodlNode, nodeDef: NodeDef) => {
	const inputDefs = nodeDef.inputs || [];

	for (const inputDef of inputDefs) {
		const inputName = inputDef.name;
		// prop нет, но есть дефолт. Нужно конвертировать, т.к. дефолты лежат в формате редактора.
		if (noodlNode.props[inputName] === undefined && inputDef.default !== undefined)
			noodlNode.props[inputName] = getConverted(noodlNode, inputDef, inputDef.default);
	}
};

// Функция конвертирует параметры ноды.
const getConverted = (noodlNode: NoodlNode, inputDef: PortDef, value: unknown) => {
	if (typeof inputDef.type === 'string') {
		if (['array', 'objectEval', 'funcEval'].includes(inputDef.type)) {
			let evalFunc: any;
			// trycatch из-за того, что ничто не мешает разработчику сохранить ошибку в редакторе.
			try {
				evalFunc = eval(value as string);
				// evalFunc - функция, то просто возвращаем. Если объект, то нужно выполнить функцию, проверить, что вернулся объект и вернуть его.
				if (inputDef.type === 'objectEval') evalFunc = evalFunc?.(noodlNode.props);
			} catch (e) {
				log.error('runtime convert default prop error.', e);
			}

			return evalFunc;
		} else return value;
	} else return value;
};

export const validatePropValue = (noodlNode: NoodlNode, inputDef: PortDef) => {
	if (inputDef.validate) {
		const validateResult = inputDef.validate(noodlNode.props);
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string')
			sendWarning(noodlNode.model, noodlNode.context, 'value', inputDef.displayName, validateResult);
		// Стандартный текст ошибки, если рзработчик вернул false.
		if (validateResult === false)
			sendWarning(
				noodlNode.model,
				noodlNode.context,
				'value',
				inputDef.displayName,
				`Input "${inputDef.displayName}" is required.`
			);
		// Сброс ошибки
		if (validateResult === true) clearWarning(noodlNode.model, noodlNode.context, 'value', inputDef.displayName);
	}
};

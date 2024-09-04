// Модель значения порта.

import typeOf from 'just-typeof';
import { type PortDef } from '@shared/port-v1.0.0';
import type { NoodlNode } from '../../main';
import { clearWarning, sendWarning } from '../models/warning';

// Функция конвертирует параметры ноды.
export const getConverted = (noodlNode: NoodlNode, inputDef: PortDef, value: unknown) => {
	if (typeof inputDef.type === 'string') {
		if (['array', 'objectEval', 'funcEval'].includes(inputDef.type)) {
			let evalFunc: any;
			// trycatch из-за того, что ничто не мешает разработчику сохранить ошибку в редакторе.
			try {
				evalFunc = eval(value as string);
				// evalFunc - функция, то просто возвращаем. Если объект, то нужно выполнить функцию, проверить, что вернулся объект и вернуть его.
				if (inputDef.type === 'objectEval') evalFunc = evalFunc?.(noodlNode.propsCache);
				clearWarning(noodlNode, inputDef.displayName);
			} catch (error) {
				sendWarning(noodlNode, inputDef.displayName, `Input "${inputDef.displayName}" error:<br/>${error}`);
			}

			return evalFunc;

			// Преобразуем proplist в обычный массив.
		} else if (inputDef.type == 'proplist') {
			return (value as { label: string }[]).map((i) => i.label);
		} else return value;
	} else return value;
};

// Функция проверяет соответствие типа данных между тем, что задано в декларации инпута и фактическим значением.
// Стандартные типы проверяются простым сравнением. Специализированные Roodl и наши eval порты проверяются каждый по своему.
export const validateValueType = (noodlNode: NoodlNode, inputDef: PortDef, value: unknown) => {
	const sendTypeWarning = (defType: any, valueType: any) => {
		sendWarning(
			noodlNode,
			inputDef.displayName,
			`Input "${inputDef.displayName}" type error:<br/>Expect "${defType}", got "${valueType}".`
		);
	};

	// eval порты могут содержать закомментированные примеры, из-за чего convertProp получает value с данными и выдает undefined.
	// Если не убрать эти undefined, сравнение по типу будет не корректным.
	if (value !== undefined) {
		const defType = inputDef.type;
		const valueType = typeOf(value);

		// Все кроме enum.
		if (typeof defType === 'string') {
			// Исключим, что нет смысла проверять.
			if (['*', 'component', 'proplist', 'signal'].includes(defType)) return;
			// Для funcEval нужно заменить тип в сообщении, чтобы слово eval не смущало разработчика.
			if (defType === 'funcEval') {
				if (valueType !== 'function') sendTypeWarning('function', valueType);
				else clearWarning(noodlNode, inputDef.displayName);
				return;
			}
			// Для objectEval не стандартное сообщение.
			if (defType === 'objectEval') {
				if (valueType !== 'object')
					sendWarning(
						noodlNode,
						inputDef.displayName,
						`Input "${inputDef.displayName}" type error:<br/>Must be function with "object" return type, got "${valueType}" return type.`
					);
				else clearWarning(noodlNode, inputDef.displayName);
				return;
			}

			// Здесь все литералы и array.
			if (defType !== valueType) sendTypeWarning(defType, valueType);
			else clearWarning(noodlNode, inputDef.displayName);
		}

		// enum.
		if (Array.isArray(defType)) {
			if (valueType !== 'string') sendTypeWarning('string', valueType);
			else clearWarning(noodlNode, inputDef.displayName);
		}
	}
};

export const validateValues = (noodlNode: NoodlNode) => {
	const inputDefsWithVaildate = noodlNode.model.portDefsCache?.inputs.filter((i: PortDef) => i.validate) || [];

	for (const inputDef of inputDefsWithVaildate) {
		const validateResult = inputDef.validate?.(noodlNode.propsCache);
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string') sendWarning(noodlNode, inputDef.displayName, validateResult);
		// Стандартный текст ошибки, если рзработчик вернул false.
		if (validateResult === false) sendWarning(noodlNode, inputDef.displayName, `Input "${inputDef.displayName}" is required.`);
		// Сброс ошибки
		if (validateResult === true) clearWarning(noodlNode, inputDef.displayName);
	}
};

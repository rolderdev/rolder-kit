import type { ResultPortDef } from '@shared/port-v1.0.0'
import type { NodeDef, NoodlNode } from '../../main'
import { clearWarning, sendWarning } from '../editorModels/warning'

// Установка дефолтных значений для props, т.к. в  runtime дефолты с редактора не применяются.
export const setPropDeafaults = (noodlNode: NoodlNode, nodeDef: NodeDef) => {
	const inputDefs = nodeDef.inNode?.inputs || []

	for (const inputDef of inputDefs) {
		const inputName = inputDef.name
		// prop нет, но есть дефолт. Нужно конвертировать, т.к. дефолты лежат в формате редактора.
		if (noodlNode.props[inputName] === undefined && inputDef.default !== undefined)
			noodlNode.props[inputName] = getConvertedDefault(noodlNode, inputDef, inputDef.default)
	}
}

// Функция конвертирует дефолтный параметр порта.
const getConvertedDefault = (noodlNode: NoodlNode, inputDef: ResultPortDef, value: unknown) => {
	if (typeof inputDef.type === 'string') {
		if (['array', 'objectEval', 'funcEval'].includes(inputDef.type)) {
			let evalFunc: any
			// trycatch из-за того, что ничто не мешает разработчику сохранить ошибку в редакторе.
			try {
				evalFunc = Function(`"use strict";return (${value})`)()
				// evalFunc - функция, то просто возвращаем. Если объект, то нужно выполнить функцию, проверить, что вернулся объект и вернуть его.
				if (inputDef.type === 'objectEval') evalFunc = evalFunc?.(noodlNode.props)
			} catch (e) {
				log.error('runtime convert default prop error.', e)
			}

			return evalFunc
		}
		return value
	}
	return value
}

// Функция проверяет соответствие типа данных между тем, что задано в декларации инпута и фактическим значением.
// В отличии от валидации параметров работает только в режиме разработки.
export const validatePropType = (noodlNode: NoodlNode, inputDef: ResultPortDef, value: unknown) => {
	const sendTypeWarning = (defType: any, valueType: any) => {
		sendWarning(
			noodlNode.model,
			noodlNode.context,
			'type',
			inputDef.displayName,
			`Input "${inputDef.displayName}" type error:<br/>Expect "${defType}", got "${valueType}".`
		)
	}

	if (value !== undefined && value !== null) {
		const defType = inputDef.type
		const valueType = R.libs.just.typeOf(value)

		// Все кроме enum.
		if (typeof defType === 'string') {
			// Исключим, что нет смысла проверять.
			//В отличии от валидации параметра, здесь нужно проверить component, т.к. можно подать его через подключение.
			if (['*', 'proplist', 'signal'].includes(defType)) return

			// eval порты в runtime передаются уже готовыми, конвертация не нужна, нужно лишь убудеиться в их корректности.
			// Для funcEval нужно заменить тип в сообщении, чтобы слово eval не смущало разработчика.
			if (defType === 'funcEval') {
				if ((valueType as any) !== 'function') sendTypeWarning('function', valueType)
				else clearWarning(noodlNode.model, noodlNode.context, 'type', inputDef.displayName)
				return
			}

			// Для objectEval не стандартное сообщение.
			if (defType === 'objectEval') {
				if (valueType !== 'object')
					sendWarning(
						noodlNode.model,
						noodlNode.context,
						'type',
						inputDef.displayName,
						`Input "${inputDef.displayName}" type error:<br/>Must be function with "object" return type, got "${valueType}" return type.`
					)
				else clearWarning(noodlNode.model, noodlNode.context, 'type', inputDef.displayName)
				return
			}

			// component подается обычной строкой.
			if (defType === 'component') {
				if ((valueType as any) !== 'string') sendTypeWarning('string', valueType)
				else clearWarning(noodlNode.model, noodlNode.context, 'type', inputDef.displayName)
				return
			}

			// Здесь все литералы, кроме component.
			if (defType !== valueType) sendTypeWarning(defType, valueType)
			else clearWarning(noodlNode.model, noodlNode.context, 'type', inputDef.displayName)
		}

		// enum. Здесь жуе выбранный из enum value, который должен быть текстом.
		if (Array.isArray(defType)) {
			if ((valueType as any) !== 'string') sendTypeWarning('string', valueType)
			else clearWarning(noodlNode.model, noodlNode.context, 'type', inputDef.displayName)
		}
	}
}

// Валидирует функцией разработчика ноды. Только в режиме разработки.
export const validatePropValue = (noodlNode: NoodlNode, inputDef: ResultPortDef) => {
	if (inputDef.validate) {
		const validateResult = inputDef.validate(noodlNode.props)
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string')
			sendWarning(noodlNode.model, noodlNode.context, 'value', inputDef.displayName, validateResult)
		// Стандартный текст ошибки, если рзработчик вернул false.
		if (validateResult === false)
			sendWarning(
				noodlNode.model,
				noodlNode.context,
				'value',
				inputDef.displayName,
				`Input "${inputDef.displayName}" is required.`
			)
		// Сброс ошибки
		if (validateResult === true) clearWarning(noodlNode.model, noodlNode.context, 'value', inputDef.displayName)
	}
}

import type { ResultPortDef } from '@shared/port-v1.0.0'
import type { GraphModelNode, JsNodeVersions, NodeContext, ReactNodeVersions } from '../../main'
import { clearWarning, hasWarnings, sendWarning } from './warning'

export const prepareParameters = (model: GraphModelNode, context: NodeContext) => {
	const inputDefs = model.portDefsCache.inputs
	// Простые инпуты, не требующие конвертации.
	const literalInputDefs = inputDefs.filter((i) =>
		typeof i.type === 'string' ? !['array', 'proplist', 'objectEval', 'funcEval'].includes(i.type) : true
	)
	const complexInputDefs = inputDefs.filter((i) => !literalInputDefs.map((i) => i.name).includes(i.name))
	// В конвертации, в эвалах, разработчик ждет готовые props. Поэтому готовим все, что можем перед ней.
	// Подготовим параметры. Все, еще не конвертируя и не валидируя.
	setParameters(model, inputDefs)
	// Сконвертируем простые типы.
	for (const inputDef of literalInputDefs) model.parametersCache[inputDef.name] = getConvertedParameter(model, context, inputDef)
	if (hasWarnings(model, 'convert')) return
	// Валидируем простые типы.
	for (const inputDef of literalInputDefs) validateType(model, context, inputDef)
	if (hasWarnings(model, 'type')) return
	// Сконвертируем сложные типы.
	for (const inputDef of complexInputDefs) model.parametersCache[inputDef.name] = getConvertedParameter(model, context, inputDef)
	if (hasWarnings(model, 'convert')) return
	// Валидируем сложные типы.
	for (const inputDef of complexInputDefs) validateType(model, context, inputDef)
	if (hasWarnings(model, 'type')) return
}

// Установка значений с параметров портов.
const setParameters = (model: GraphModelNode, inputDefs: ResultPortDef[]) => {
	for (const inputDef of inputDefs) {
		const inputName = inputDef.name

		// Параметр установлен.
		if (model.parameters[inputName] !== undefined) {
			model.parametersCache[inputName] = model.parameters[inputName]
			// Параметра нет, но есть дефолт.
		} else if (inputDef.default !== undefined) {
			model.parametersCache[inputName] = inputDef.default
			model.parameters[inputName] = inputDef.default
			// Параметра нет и нет дефолта.
		} else delete model.parametersCache[inputName]
	}
}

// Функция проверяет соответствие типа данных между тем, что задано в декларации инпута и фактическим значением.
// Стандартные типы проверяются простым сравнением. Специализированные Roodl и наши eval порты проверяются каждый по своему.
export const validateType = (model: GraphModelNode, context: NodeContext, inputDef: ResultPortDef) => {
	const sendTypeWarning = (defType: any, valueType: any) => {
		sendWarning(
			model,
			context,
			'type',
			inputDef.displayName,
			`Input "${inputDef.displayName}" type error:<br/>Expect "${defType}", got "${valueType}".`
		)
	}

	const value: unknown = model.parametersCache[inputDef.name]

	// eval порты могут содержать закомментированные примеры, из-за чего convertProp получает value с данными и выдает undefined.
	// Если не убрать эти undefined, сравнение по типу будет не корректным.
	if (value !== undefined) {
		const defType = inputDef.type
		const valueType = R.libs.just.typeOf(value)

		// Все кроме enum.
		if (typeof defType === 'string') {
			// Исключим, что нет смысла проверять.
			if (['*', 'component', 'proplist', 'signal'].includes(defType)) return

			// Для funcEval нужно заменить тип в сообщении, чтобы слово eval не смущало разработчика.
			if (defType === 'funcEval') {
				if (valueType !== 'function') sendTypeWarning('function', valueType)
				else clearWarning(model, context, 'type', inputDef.displayName)
				return
			}

			// Для objectEval не стандартное сообщение.
			if (defType === 'objectEval') {
				if (valueType !== 'object')
					sendWarning(
						model,
						context,
						'type',
						inputDef.displayName,
						`Input "${inputDef.displayName}" type error:<br/>Must be function with "object" return type, got "${valueType}" return type.`
					)
				else clearWarning(model, context, 'type', inputDef.displayName)
				return
			}

			// Здесь все литералы.
			if (defType !== valueType) sendTypeWarning(defType, valueType)
			else clearWarning(model, context, 'type', inputDef.displayName)
		}

		// enum. Здесь жуе выбранный из enum value, который должен быть текстом.
		if (Array.isArray(defType)) {
			if (valueType !== 'string') sendTypeWarning('string', valueType)
			else clearWarning(model, context, 'type', inputDef.displayName)
		}
	}
}

// Функция конвертирует параметры ноды.
export const getConvertedParameter = (model: GraphModelNode, context: NodeContext, inputDef: ResultPortDef) => {
	// Нужно брать с кеша, т.к. в нем отчищаются зависимые значения.
	const value: unknown = model.parameters[inputDef.name]

	if (typeof inputDef.type === 'string') {
		if (['array', 'objectEval', 'funcEval'].includes(inputDef.type)) {
			let evalFunc: any
			// trycatch из-за того, что ничто не мешает разработчику сохранить ошибку в редакторе.
			try {
				// Если функция указана в таком формате "(level, item) => level * 16", то Roodl пересоздает компаненту. Хз почему.
				// Поэтому, скажем разработчику, что нужно использовать return.
				if (!Noodl.deployed && ['objectEval', 'funcEval'].includes(inputDef.type) && value && !(value as any).includes('return'))
					sendWarning(model, context, 'convert', inputDef.displayName, `Function at "${inputDef.displayName}" must have return.`)
				else clearWarning(model, context, 'convert', inputDef.displayName)

				evalFunc = Function(`return ${value}`)()
				// evalFunc - функция, то просто возвращаем. Если объект, то нужно выполнить функцию, проверить, что вернулся объект и вернуть его.
				if (inputDef.type === 'objectEval') evalFunc = evalFunc?.(model.parametersCache)
				// Исключим для runtime.
				//if (!Noodl.deployed) clearWarning(model, context, 'convert', inputDef.displayName)
			} catch (error) {
				// Исключим для runtime.
				if (!Noodl.deployed)
					sendWarning(model, context, 'convert', inputDef.displayName, `Input "${inputDef.displayName}" error:<br/>${error}`)
				// Но отправим в консоль.
				log.error(`Input "${inputDef.displayName}" error:<br/>${error}`)
			}

			return evalFunc
		}

		if (inputDef.type === 'proplist') {
			return (value as { label: string }[])?.map((i) => i.label)
		}

		return value
	}

	return value
}

export const validateParameterValues = (
	model: GraphModelNode,
	context: NodeContext,
	versions: JsNodeVersions | ReactNodeVersions
) => {
	const inputDefsWithVaildate = versions[model.parameters.version].inNode?.inputs?.filter((i) => i.validate) || []

	for (const inputDef of inputDefsWithVaildate) {
		// Не будем валидировать, если есть подключение.
		if (model.component.connections.some((i: any) => i.targetId === model.id && i.targetPort === inputDef.name)) return
		const validateResult = inputDef.validate?.(model.parametersCache)
		// Если разработчик вернул свой текст ошибки.
		if (typeof validateResult === 'string') sendWarning(model, context, 'value', inputDef.displayName, validateResult)
		// Стандартный текст ошибки, если рзработчик вернул false.
		if (validateResult === false)
			sendWarning(model, context, 'value', inputDef.displayName, `Input "${inputDef.displayName}" is required.`)
		// Сброс ошибки
		if (validateResult === true) clearWarning(model, context, 'value', inputDef.displayName)
	}
}

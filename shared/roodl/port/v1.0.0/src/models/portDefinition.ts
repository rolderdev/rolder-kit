// Модель порта. Определяет схему порта, по которой они добавляются в схему ноды.

import '@shared/types-v0.1.0'
import {
	type InferOutput,
	any,
	array,
	boolean,
	check,
	function_,
	number,
	object,
	optional,
	parse,
	picklist,
	pipe,
	string,
	transform,
	union,
} from 'shared/src/libs/valibot'

// Задаим схему порта в удобном для определения виде.
export const PortDef = pipe(
	object({
		name: string(),
		displayName: string(),
		// Строгий список, чтобы не опечатываться.
		group: picklist(['Version', 'Data', 'Params', 'Layout', 'Dimensions', 'Styles', 'Signals', 'States', 'Advanced', 'Custom']),
		customGroup: optional(string()), // Но оставим возможность задавать кастомную группу.
		/* Зададим тип так, чтобы было удобно его определять. Оставим только список строгих литералов и массив enum.
			Варианты objectEval и funcEval  - это наш специальный тип для передачи объекта или функции из редактора. Roodl в редакторе включает
		JS только для массивов. Объект просто не открывается в редакторе, его можно передать только через подключение. А нам нужно давать
		разработчику возможность задавать параметры через объект или передавать функцию. При это все это хранится для каждой ноды в project.json,
		а значит любой JS-код - это текст, поэтому названия с eval (тобишь мы потом будем его конверировать через eval).
			Решение - уславливаемся, что eval, всегда функция, говорим Roodl, что это массив (чтобы можно было открыть редактор), разработчик
			игнорирует (ну, он и не знает) массив и просто задает функцию, обрабатываем через eval, проверяя что тип функция. Для funcEval
			просто сохраняем функцию (ее как то мы применяем в каждой ноде), а для objectEval выполняем ее, чтобы передать в ноду результат. */
		type: optional(
			union([
				picklist([
					'*',
					'string',
					'number',
					'boolean',
					'array',
					'object',
					'objectEval',
					'funcEval',
					'signal',
					'proplist',
					'component',
				]),
				array(object({ value: string(), label: string() })),
			]),
			'string'
		),
		default: optional(union([string(), number(), boolean()])),
		// Для 'array', 'objectEval', и 'funcEval'. Чтобы можно было передать в редактор закоментированный пример кода.
		codeComment: optional(string()),
		visibleAt: optional(picklist(['editor', 'connection', 'both'])),
		tooltip: optional(string()),
		multiline: optional(boolean()),
		dependsOn: optional(function_()),
		validate: optional(function_()),
		transform: optional(any()),
	}),
	// Ругаемся, если группа указана кастомная, но не определена.
	check((i) => (i.group === 'Custom' ? !!i.customGroup : true), 'Custom group is not defined'),
	// Заменим группу кастомной, если указана, чтобы не делать проверок потом.
	transform((i) => {
		const result = { ...i }
		if (result.group === 'Custom' && result.customGroup) result.group = result.customGroup as any
		result.customGroup = undefined
		// Установим пример-комментарий для типов с кодом и удалим default, чтобы не дать разработчику накосячить.
		if (typeof result.type === 'string' && ['array', 'objectEval', 'funcEval'].includes(result.type)) {
			if (result.codeComment) result.default = result.codeComment
			else result.default = undefined
			result.codeComment = undefined
		}
		return result
	})
)

// Обрати внимание, что тип и схема называются одинаково. Это рекомендованная конвенция valibot.
// Не разобрался как типизировать функции с ValiBot, поэтому тут типизирую вручную.
export type PortDef = Omit<InferOutput<typeof PortDef>, 'dependsOn' | 'validate' | 'transform'> & {
	dependsOn?(p: { [key: string]: any }): boolean
	validate?(p: { [key: string]: any }): boolean | string
	transform?(p: { [key: string]: any }, portDef: ResultPortDef): void
}

// Тип после трансформации Valibot. Нужен, чтобы избежать путанницы с группой - она может быть любой из-за Custom.
export type ResultPortDef = Omit<PortDef, 'group' | 'customGroup'> & { group: string }

export const getPortDef = (portDef: PortDef) => parse(PortDef, portDef) as ResultPortDef

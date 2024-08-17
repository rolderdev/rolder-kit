// Модель порта. Определяет схему порта, по которой они добавляются в схему ноды.

import {
	any,
	array,
	boolean,
	check,
	function_,
	type InferOutput,
	number,
	object,
	optional,
	parse,
	picklist,
	pipe,
	string,
	transform,
	union,
} from 'valibot';

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
		dependsOn: optional(function_()),
		validate: optional(function_()),
		transform: optional(any()),
	}),
	// Ругаемся, если группа указана кастомная, но не определена.
	check((i) => (i.group === 'Custom' ? (i.customGroup ? true : false) : true), 'Custom group is not defined'),
	// Заменим группу кастомной, если указана, чтобы не делать проверок потом.
	transform((i) => {
		if (i.group === 'Custom' && i.customGroup) i.group = i.customGroup as any;
		delete i.customGroup;
		// Установим пример-комментарий для типов с кодом и удалим default, чтобы не дать разработчику накосячить.
		if (typeof i.type === 'string' && ['array', 'objectEval', 'funcEval'].includes(i.type)) {
			if (i.codeComment) i.default = i.codeComment;
			else delete i.default;
			delete i.codeComment;
		}

		return i;
	})
);

// Обрати внимание, что тип и схема называются одинаково. Это рекомендованная конвенция valibot.
// Не разобрался как типизировать функции с ValiBot, поэтому тут тпизирую вручную.
export type PortDef = Omit<InferOutput<typeof PortDef>, 'dependsOn' | 'validate' | 'transform'> & {
	dependsOn?(p: { [key: string]: any }): boolean;
	validate?(p: { [key: string]: any }): boolean | string;
	transform?(p: { [key: string]: any }, portDef: PortDef): PortDef;
};

export const getPortDef = (portDef: PortDef) => parse(PortDef, portDef) as PortDef;

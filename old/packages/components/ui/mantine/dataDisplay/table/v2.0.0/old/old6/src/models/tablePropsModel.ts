/* Модель настроек таблицы. */

import isEqual from 'lodash.isequal'
import { z } from 'zod'
import type { Props } from '../../types'
import stringifyObjectFuncs from '../funcs/stringifyObjectFuncs'
import type { Store } from '../store'

// Схема задает типы данных и их дефолты.
const tablePropsSchema = z.object({
	// Base
	onRowClick: z.enum(['disabled', 'signal', 'singleSelection', 'expansion']),
	clickFilterFunc: z
		.function()
		.args(z.object({ id: z.string() }).passthrough())
		.returns(z.boolean())
		.optional(),
	singleSelectionFilterFunc: z
		.function()
		.args(z.object({ id: z.string() }).passthrough())
		.returns(z.boolean())
		.optional(),
	// Scope
	scope: z.object({ dbClass: z.string() }).optional(),
	// Table styles
	animation: z.boolean().optional(),
	// Row styles
	rowStyles: z
		.object({
			rowBackgroundColor: z.string().default('white'),
			singleSelectionRowBgColor: z.string().default('white'),
			mutliSelectionRowBgColor: z.string().default('white'),
		})
		.default({}),
	// Multi selection
	multiSelection: z.boolean().default(false),
	// Expansion
	expansion: z.object({
		enabled: z.boolean().default(false),
		template: z.string().optional(),
		allowMultiple: z.boolean().default(false),
		collapseProps: z
			.object({
				transitionDuration: z.number().default(150),
				transitionTimingFunction: z.string().default('ease'),
				animateOpacity: z.boolean().default(true),
			})
			.default({}), // Дефолтные значения подставтся из типов выше.
		filterFunc: z
			.function()
			.args(z.object({ id: z.string() }).passthrough())
			.returns(z.boolean())
			.optional(),
		paddingLeft: z.object({
			position: z.enum(['checkbox', 'expander', 'cell']).default('expander'),
			value: z.number().default(0),
		}),
	}),
	// Sort
	sort: z.object({
		enabled: z.boolean().default(false),
		type: z.enum(['frontend', 'backend']).optional(),
	}),
})

export type TableProps = z.infer<typeof tablePropsSchema>

// Функция проверяет прилетевшие знаяения с портов и восстаналвивает дефолты, если значение не прилетело.
export const getTableProps = (p: Props) =>
	tablePropsSchema.parse({
		...p,
		scope: p.scopeDbClass ? { dbClass: p.scopeDbClass } : undefined,
		animation: p.expansion ? false : p.animation, // Нужно отключить анимацию для разворачиваемой таблицы.
		rowStyles: { ...p }, // ...p - Zod сам проставит совпадающие значения.
		expansion: {
			...p,
			enabled: p.expansion,
			template: p.expansionTemplate,
			collapseProps: p.customProps?.collapse,
			filterFunc: p.expansionFilterFunc,
			paddingLeft: {
				position: p.multiSelection ? 'checkbox' : p.columnsDefinition?.some((i) => i.expander) ? 'expander' : 'cell',
				value: p.paddingLeft,
			},
		},
		multiSelection: p.multiSelection,
		sort: { enabled: p.sort, type: p.sortType },
	} as TableProps)

// Метод обновляет состояние настроек.
export const setTableProps = (store: Store, p: Props) => {
	const newProps = getTableProps(p)
	if (!isEqual(stringifyObjectFuncs(store.tableProps.get()), stringifyObjectFuncs(newProps))) store.tableProps.assign(newProps)
}

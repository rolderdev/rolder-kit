/* Модель настроек таблицы. */

import isEqual from 'lodash.isequal'
import { z } from 'zod'
import type { Props } from '../../types'
import stringifyObjectFuncs from '../funcs/stringifyObjectFuncs'
import type { Store } from '../store/store'

// Схема задает типы данных и их дефолты.
const tablePropsSchema = z.object({
	// Base
	onRowClick: z.enum(['disabled', 'signal', 'function', 'singleSelection', 'expansion']),
	// Функции - нужно деражить в корне, чтобы не городить сложную функцию сравнения.
	clickFunc: z
		.function()
		// Важно не проверять иерархию, т.к. проверка ломает ее, поэтому z.any()
		.args(z.object({ id: z.string() }).passthrough(), z.array(z.object({ id: z.string() }).passthrough()), z.any())
		.optional(),
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
	multiSelectionFilterFunc: z
		.function()
		.args(z.object({ id: z.string() }).passthrough())
		.returns(z.boolean())
		.optional(),
	expansionFilterFunc: z
		.function()
		.args(z.object({ id: z.string() }).passthrough())
		.returns(z.boolean())
		.optional(),
	paddingLeftFunc: z
		.function()
		.args(z.number(), z.object({ id: z.string() }).passthrough().optional())
		.returns(z.number())
		.optional(),
	needsNoodlObjects: z.boolean().default(false), // Флаг для определения нужно ли создавать Noodl-объекты.
	// Scope
	scope: z.object({ dbClass: z.string() }).optional(),
	// Row styles
	rowStyles: z
		.object({
			rowBackgroundColor: z.string().default('white'),
			singleSelectionRowBgColor: z.string().default('white'),
			mutliSelectionRowBgColor: z.string().default('white'),
			paddingLeftPostion: z.enum(['checkbox', 'expander', 'cell']).default('expander'),
		})
		.default({}),
	// Multi selection
	multiSelection: z.boolean().default(false),
	// Expansion
	expansion: z
		.object({
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
		})
		.default({}),
	// Sort
	sort: z
		.object({
			enabled: z.boolean().default(false),
			type: z.enum(['frontend', 'backend']).optional(),
		})
		.default({}),
})

export type TableProps = z.infer<typeof tablePropsSchema>

export const getTableProps = (p: Props) =>
	tablePropsSchema.parse({
		...p,
		needsNoodlObjects: p.expansion || p.columnsDefinition?.some((i) => i.type === 'template'), // Определим нужны ли Noodl-объекты.
		scope: p.scopeDbClass ? { dbClass: p.scopeDbClass } : undefined,
		rowStyles: {
			...p, // ...p - Zod сам проставит совпадающие значения.
			paddingLeftPostion: p.multiSelection ? 'checkbox' : p.expansion ? 'expander' : 'cell',
		},
		expansion: {
			...p,
			enabled: p.expansion,
			template: p.expansionTemplate,
			collapseProps: p.customProps?.collapse,
		},
		multiSelection: p.multiSelection,
		sort: { enabled: p.sort, type: p.sortType },
	} as TableProps)

export const tablePropsChanged = (s: Store, p: Props) => {
	const newProps = getTableProps(p)
	if (!isEqual(stringifyObjectFuncs(s.cold.tableProps.get()), stringifyObjectFuncs(newProps))) return true
	else return false
}

export const setTableProps = (s: Store, p: Props) => {
	const newProps = getTableProps(p)
	s.cold.tableProps.set(newProps)
}

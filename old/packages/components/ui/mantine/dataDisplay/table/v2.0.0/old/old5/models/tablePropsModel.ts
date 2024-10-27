/* Модель настроек таблицы. */

import isEqual from 'lodash.isequal'
import { z } from 'zod'
import type { Props } from '../../types'
import stringifyObjectFuncs from '../funcs/stringifyObjectFuncs'
import type { Store } from '../store/store'

// Схема задает типы данных и их дефолты.
const tablePropsSchema = z.object({
	// Base
	onRowClick: z.enum(['disabled', 'signal', 'singleSelection', 'expansion']),
	// Row styles
	rowStyles: z
		.object({
			rowBackgroundColor: z.string().default('white'),
			singleSelectionRowBgColor: z.string().default('white'),
			mutliSelectionRowBgColor: z.string().default('white'),
		})
		.default({}),
	// Selection
	selection: z
		.object({
			single: z
				.object({
					enabled: z.boolean().default(false),
					unselectable: z.boolean().default(false),
				})
				.default({}),
			multi: z.boolean().default(false),
		})
		.default({}),
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
		rowStyles: { ...p }, // ...p - Zod сам проставит совпадающие значения.
		expansion: { ...p, enabled: p.expansion, template: p.expansionTemplate, collapseProps: p.customProps?.collapse },
		selection: { single: { enabled: p.singleSelection, unselectable: p.unselectable }, multi: p.multiSelection },
		sort: { enabled: p.sort, type: p.sortType },
	} as TableProps)

// Метод обновляет состояние настроек.
export const setTableProps = (store: Store, p: Props) =>
	store.setState((s) => {
		// Сравниваем праметры, включая функции и вложенный customProps.
		const newProps = getTableProps(p)
		if (!isEqual(stringifyObjectFuncs(s.tableProps), stringifyObjectFuncs(newProps))) return { tableProps: newProps }
		else return s
	})

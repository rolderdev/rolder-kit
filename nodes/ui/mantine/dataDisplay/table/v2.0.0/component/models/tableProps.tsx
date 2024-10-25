/* Модель настроек таблицы. */

import type { DataTableSortStatus } from 'mantine-datatable'
import type { Props } from '../../node/definition'
import type { Store } from '../store'
import type { TableRecord } from './record'

export type TableProps = ReturnType<typeof setTableProps>

// Устанавливает наши специфичные настройки таблицы. В итоговых данных не должно быть функций.
export const setTableProps = (p: Props, s: Store) => {
	const defaultSortColumnDef = p.columnsDefinition?.find((i) => i.sort?.defaultDirection)
	const defaultSortColumnIdx = defaultSortColumnDef ? p.columnsDefinition?.indexOf(defaultSortColumnDef) : undefined

	const tableProps = {
		...R.libs.just.pick(p, [
			// Base
			'onRowClick',
			'useSingleSelectionHierarchy',
		]),
		rowStyles: {
			rowBackgroundColor: p.rowBackgroundColor || 'white',
			singleSelectionRowBgColor: p.singleSelectionRowBgColor || 'white',
			mutliSelectionRowBgColor: p.mutliSelectionRowBgColor || 'white',
			paddingLeftPostion: p.multiSelection ? 'checkbox' : p.expansion ? 'expander' : 'cell',
		},
		multiSelection: {
			enabled: p.multiSelection,
			useHierarchy: p.useMultiSelectionHierarchy,
		},
		expansion: {
			enabled: p.expansion,
			allowMultiple: p.allowMultiple,
			template: p.expansionTemplate,
			useHierarchy: p.useExpansionHierarchy,
			animationChildrenCount: p.animationChildrenCount || 25,
			collapseProps: {
				transitionDuration: 150,
				transitionTimingFunction: 'ease',
				animateOpacity: true,
				...p.customProps?.collapseProps,
			},
		},
		sort: {
			enabled: p.sort,
			type: p.sortType,
			defaultState:
				defaultSortColumnDef?.sort?.defaultDirection && defaultSortColumnIdx !== undefined
					? ({
							columnAccessor:
								defaultSortColumnDef.accessor || defaultSortColumnDef.sort?.sortPath || defaultSortColumnIdx.toString(),
							direction: defaultSortColumnDef.sort?.defaultDirection,
						} satisfies DataTableSortStatus<TableRecord>)
					: undefined,
		},
	}

	s.tableProps = tableProps

	return tableProps // Только для типизации.
}

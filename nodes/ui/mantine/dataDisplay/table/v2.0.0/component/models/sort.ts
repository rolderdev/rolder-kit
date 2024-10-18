import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import type { Item } from '@shared/types-v0.1.0'
/* Модель сортировки. */
import type { DataTableSortStatus } from 'mantine-datatable'
import useItem from '../funcs/useItem'
import type { Store } from '../store'
import { getColumns } from './column'
import { getFilteredIds } from './filter'
import type { TableRecord } from './record'

export type Sort = {
	defaultDirection?: 'asc' | 'desc'
	sortPath?: string
	func?: (state: 'asc' | 'desc', items: Item[], node?: any) => Item[] | undefined
}

export const setSortState = (s: Store, sortState: DataTableSortStatus<TableRecord>, firstTime?: boolean) => {
	s.sortState = sortState

	// Отсортируем items, если включена фронтовая сортировка.
	const sort = s.tableProps.sort
	if (sort.enabled && sort.type === 'frontend') {
		const sortedIds = getSortedIds(s).filter((id) => getFilteredIds(s).includes(id))
		s.records = sortedIds.map((id) => ({ id }))
	}

	// Отправим состояние сортировки в формате удобном для useData.
	sendOutput(s.noodlNode, 'sortState', { [sortState.columnAccessor]: sortState.direction })
	if (!firstTime) sendSignal(s.noodlNode, 'sortStateChanged')
}

export const getSortedIds = (s: Store) => {
	const sortState = s.sortState

	const items = s.originalIds.map((id) => useItem(id, 'snap')).filter((i) => !!i)
	if (sortState) {
		const sortColumnDef = getColumns(s).find((i) => i.accessor === sortState?.columnAccessor)
		if (sortColumnDef?.sort?.func) {
			const sortedItems = sortColumnDef?.sort?.func(
				sortState.direction,
				items,
				s.hierarchy.tableNode ? R.libs.valtio.snapshot(s.hierarchy.tableNode) : undefined
			)
			return sortedItems?.map((i) => i.id) || items.map((i) => i.id)
		} else return R.utils.naturalSort.v1(items, sortState.columnAccessor, sortState.direction).map((i) => i.id as string)
	} else return items.map((i) => i.id)
}

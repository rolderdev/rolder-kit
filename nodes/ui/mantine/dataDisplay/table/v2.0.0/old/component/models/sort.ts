import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import type { Item } from '@shared/types-v0.1.0'
/* Модель сортировки. */
import type { DataTableSortStatus } from 'mantine-datatable'
import useItem from '../funcs/useItem'
import type { Store } from '../store'
import { getColumns } from './column'
import { getFilteredIds } from './filter'
import type { TableRecord } from './record'
import { useEffect } from 'react'

export type Sort = {
	defaultDirection?: 'asc' | 'desc'
	sortPath?: string
	func?: (state: 'asc' | 'desc', items: Item[], node?: any) => Item[] | undefined
}

export const setSortState = (s: Store, sortState: DataTableSortStatus<TableRecord>, firstTime?: boolean) => {
	s.sort.state = sortState

	// Добавим сосотояние фильтрации в иерархию.
	if (!s.hierarchy.isChild) {
		const tableNode = s.hierarchy.tableNode
		const sortColumnDef = getColumns(s).find((i) => i.accessor === sortState?.columnAccessor)
		if (tableNode && sortColumnDef) tableNode.states.sort.value = { direction: sortState.direction, idx: sortColumnDef.idx }
	}

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
	const sortState = s.sort.state

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
		}
		return R.utils.naturalSort.v1(items, sortState.columnAccessor, sortState.direction).map((i) => i.id as string)
	}
	return items.map((i) => i.id)
}

export const useHierarchySortState = (s: Store) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const rootNode = s.hierarchy.tableNode?.rootNode()

		if (s.hierarchy.isChild && rootNode?.states.sort && !s.sort.unsub) {
			const state = rootNode.states.sort.value
			if (state.idx) {
				const columnAccessor = getColumns(s).find((i) => i.idx === state.idx)?.accessor
				if (columnAccessor) setSortState(s, { direction: state.direction, columnAccessor })
			}
			const unsub = R.libs.valtio.subscribe(rootNode.states.sort, () => {
				const state = rootNode.states.sort.value
				if (state.idx) {
					const columnAccessor = getColumns(s).find((i) => i.idx === state.idx)?.accessor
					if (columnAccessor) setSortState(s, { direction: state.direction, columnAccessor })
				}
			})

			s.sort.unsub = unsub
		}
	}, [Boolean(s.hierarchy.tableNode)])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		return () => s.sort.unsub?.()
	}, [])
}

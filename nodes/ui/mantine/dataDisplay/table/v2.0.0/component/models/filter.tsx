/* Модель фильтрации. */

import type { FilterState } from '@nodes/table-filter-v0.1.0'
import type { Item } from '@shared/types-v0.1.0'
import { memo, useEffect, useState } from 'react'
import getRoodlReactNode from '../shared/getRoodlReactNode'
import useItem from '../shared/useItem'
import { type Store, useStore } from '../store'
import { getSortedIds } from './sort'

export type Filter = {
	template: string
	defaultState?: FilterState
	func?: (state: FilterState, items: Item[], node?: any) => Item[] | undefined
}

// Подготовка хранилища.
export const setInitialFiltersState = (s: Store) => {
	for (const [id, column] of Object.entries(s.columns)) {
		if (column.filterDef) {
			const defaultState = column.filterDef?.defaultState

			if (defaultState) {
				// Нужно клонировать, чтобы прокси в декларации колонки не выступал реактивным хранилищем.
				s.filters.states[id] = { ...R.libs.just.omit(defaultState, ['value']), defaultValue: defaultState.value }
				// Применим функцию, если фильтр включен в дефолтном состоянии.
				if (defaultState?.enabled) filter(s, column.filterDef, id)
			} else {
				if (!s.filters.inited[id]) s.filters.states[id] = { enabled: false, value: null, defaultValue: null }
				const rootNode = s.hierarchy?.tableNode?.rootNode()
				if (rootNode && s.hierarchy?.isChild) {
					s.filters.states[id] = rootNode.states.filters.value[id]
					filter(s, column.filterDef, id)
				}
			}

			s.filters.inited[id] = true
		}
	}
}

// Хук подписки на изменение значений фильтров.
export const useFiltersValue = (s: Store) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const unsubs: Record<string, (() => void) | undefined> = {}

		for (const [id, column] of Object.entries(s.columns)) {
			if (column.filterDef && s.filters.states[id]) {
				const unsub = R.libs.valtio.subscribeKey(s.filters.states[id], 'value', () => {
					if (column.filterDef) filter(s, column.filterDef, id)
					column.filtering = s.filters.states[id].enabled
				})
				unsubs[id] = unsub
			}
		}

		// Отписка при демонтировании таблицы.
		return () => {
			for (const u of Object.values(unsubs)) u?.()
		}
	}, [Object.keys(s.filters.inited)])
}
export const handleFilters = (s: Store) => {
	for (const [id, column] of Object.entries(s.columns)) {
		if (column.filterDef && s.filters.states[id]) {
			if (column.filterDef) filter(s, column.filterDef, id)
			column.filtering = s.filters.states[id].enabled
		}
	}
}

export const getFilteredIds = (s: Store) => {
	let ids: string[] = s.originalIds
	for (const [id, column] of Object.entries(s.columns)) {
		const filterState = s.filters.states[id]
		if (column.filterDef && filterState && filterState.enabled && filterState.ids) {
			ids = filterState.ids.filter((id) => ids.includes(id))
		}
	}

	return ids
}

// Компонента фильтрации.
export const FilterComponent = memo((p: { tableId: string; columnId: string; close: () => void }) => {
	const s = useStore(p.tableId)
	const sn = R.libs.valtio.useSnapshot(s)

	// Кастомный Suspense.
	const [filterComponent, setFilterComponent] = useState<React.ReactNode | undefined>(undefined)
	const tableId = s.hierarchy?.tableNode?.itemId || R.libs.nanoid(8)
	const templateSn = R.libs.just.get(sn.columns, [p.columnId, 'filterDef', 'template'])
	const level = s.hierarchy?.level || 0
	const filterStateStore = s.filters.states?.[p.columnId]

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (templateSn && filterStateStore)
			getRoodlReactNode(s, tableId, templateSn, {
				itemId: tableId,
				columnId: p.columnId,
				filterState: filterStateStore,
				close: p.close,
				level,
			}).then((reactNode) => setFilterComponent(reactNode))
	}, [templateSn])

	//console.log('FilterComponent render', filterComponent) // Считаем рендеры пока разрабатываем
	return filterComponent
})

// Хук подписки на изменение значений фильтров в иерархии.
export const useHierarchyFiltersValue = (s: Store) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let unsub: (() => void) | undefined
		const rootNode = s.hierarchy?.tableNode?.rootNode()

		if (s.hierarchy?.isChild && !unsub && rootNode?.states.filters.value) {
			unsub = R.libs.valtio.subscribe(rootNode.states.filters.value, () => {
				for (const [id, column] of Object.entries(s.columns)) {
					const rootState = rootNode.states.filters.value[id]
					if (rootState) {
						s.filters.states[id] = { enabled: rootState.enabled, value: rootState.value, defaultValue: rootState.defaultValue }

						const filterResult = column.filterDef?.func?.(
							R.libs.valtio.snapshot(s.filters.states[id]),
							s.originalIds.map((id) => useItem(id, 'snap')).filter((i) => !!i),
							s.hierarchy?.tableNode ? R.libs.valtio.snapshot(s.hierarchy.tableNode) : undefined
						)

						if (filterResult) {
							s.filters.states[id].ids = filterResult.map((i) => i.id)
							s.records = getSortedIds(s)
								.filter((id) => getFilteredIds(s).includes(id))
								.map((id) => ({ id }))
						}
					}
				}
			})
		}

		return () => unsub?.()
	}, [])
}

const filter = (s: Store, filterDef: Filter, columnId: string) => {
	const filterState = s.filters.states[columnId]

	const filterResult = filterDef.func?.(
		R.libs.valtio.snapshot(filterState),
		s.records.map((i) => useItem(i.id, 'snap')).filter((i) => !!i),
		s.hierarchy?.tableNode ? R.libs.valtio.snapshot(s.hierarchy?.tableNode) : undefined
	)

	if (filterResult) {
		filterState.ids = filterResult.map((i) => i.id)
		s.records = getSortedIds(s)
			.filter((id) => getFilteredIds(s).includes(id))
			.map((id) => ({ id }))

		const rootNode = s.hierarchy?.tableNode?.rootNode()

		if (rootNode && !s.hierarchy?.isChild) {
			rootNode.states.filters.value[columnId] = {
				enabled: filterState.enabled,
				defaultValue: filterState.defaultValue,
				value: filterState.value,
			}
		}
	}
}

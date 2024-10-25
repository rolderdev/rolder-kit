/* Модель фильтрации. */

import { useShallowEffect } from '@mantine/hooks'
import type { FilterState } from '@nodes/table-filter-v0.1.0'
import type { Item } from '@shared/types-v0.1.0'
import { memo, useContext, useEffect, useState } from 'react'
import { TableContext } from '../TableProvider'
import getRoodlReactNode from '../funcs/getRoodlReactNode'
import useItem from '../funcs/useItem'
import type { Store } from '../store'
import { getSortedIds } from './sort'

export type Filter = {
	template: string
	defaultState?: FilterState
	func?: (state: FilterState, items: Item[], node?: any) => Item[] | undefined
}

// Подготовка хранилища.
export const setInitialFiltersState = (s: Store, items: Item[]) => {
	const { map, omit } = R.libs.just

	s.filters.state = {}
	map(s.columnsDefinition, (idx, definition) => {
		if (s.filters.state) {
			let defaultState = definition.filter?.defaultState
			const rootNode = s.hierarchy.tableNode?.rootNode()
			if (rootNode && s.hierarchy.isChild) defaultState = rootNode.states.filters.value[idx]

			if (defaultState) {
				// Нужно клонировать, чтобы прокси в декларации колонки не выступал реактивным хранилищем.
				s.filters.state[idx] = { ...omit(defaultState, ['value']), defaultValue: defaultState.value }
			} else s.filters.state[idx] = { enabled: false, value: null, defaultValue: null }

			// Применим функцию, если фильтр включен в дефолтном состоянии.
			if (defaultState?.enabled && definition.filter) {
				const filterResult = definition.filter.func?.(
					R.libs.valtio.snapshot(defaultState),
					items.map((i) => useItem(i.id, 'snap')).filter((i) => !!i),
					s.hierarchy.tableNode ? R.libs.valtio.snapshot(s.hierarchy.tableNode) : undefined
				)

				if (filterResult) {
					s.filters.state[idx].ids = filterResult.map((i) => i.id)
					s.records = getSortedIds(s)
						.filter((id) => getFilteredIds(s).includes(id))
						.map((id) => ({ id }))
				}
			}
		}
	})
}

// Хук подписки на изменение значений фильтров.
export const useFiltersValue = (s: Store) => {
	const [unsubs, setUnsubs] = useState<Record<string, (() => void) | undefined>>({})

	useShallowEffect(() => {
		R.libs.just.map(s.columnsDefinition, (idx, definition) => {
			if (s.filters.state) {
				const unsub = R.libs.valtio.subscribeKey(s.filters.state[idx], 'value', () => {
					const filterState = s.filters.state?.[idx]

					if (filterState) {
						const filterResult = definition.filter?.func?.(
							R.libs.valtio.snapshot(filterState),
							s.originalIds.map((id) => useItem(id, 'snap')).filter((i) => !!i),
							s.hierarchy.tableNode ? R.libs.valtio.snapshot(s.hierarchy.tableNode) : undefined
						)

						if (filterResult && s.filters.state?.[idx]) {
							s.filters.state[idx].ids = filterResult.map((i) => i.id)
							s.records = getSortedIds(s)
								.filter((id) => getFilteredIds(s).includes(id))
								.map((id) => ({ id }))

							const rootNode = s.hierarchy.tableNode?.rootNode()

							if (rootNode && !s.hierarchy.isChild) {
								const filtersState = s.filters.state[idx]
								rootNode.states.filters.value[idx] = {
									enabled: filtersState.enabled,
									defaultValue: filtersState.defaultValue,
									value: filtersState.value,
								}
							}
						}
					}
				})
				setUnsubs({ ...unsubs, [idx]: unsub })
			}
		})
	}, [])

	// Отписка при демонтировании таблицы.
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		return () => {
			for (const u of Object.values(unsubs)) u?.()
		}
	}, [])
}

export const getFilteredIds = (s: Store) => {
	let ids: string[] = s.originalIds
	if (s.filters.state) {
		for (const filterState of Object.values(s.filters.state)) {
			if (filterState.enabled && filterState.ids) {
				ids = filterState.ids.filter((id) => ids.includes(id))
			}
		}
	}
	return ids
}

// Компонента фильтрации.
export const FilterComponent = memo((p: { columnIdx: string; close: () => void }) => {
	const store = useContext(TableContext)

	// Кастомный Suspense.
	const [filterComponent, setFilterComponent] = useState<React.ReactNode | undefined>(undefined)
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const tableId = store.hierarchy.tableNode?.itemId || R.libs.nanoid(8)
		const template = R.libs.just.get(store.columnsDefinition, [p.columnIdx, 'filter', 'template'])
		const filterState = store.filters.state?.[p.columnIdx]
		if (template && filterState)
			getRoodlReactNode(store, tableId, template, {
				itemId: tableId,
				columnIdx: p.columnIdx,
				filterState,
				close: p.close,
				level: store.hierarchy.level,
			}).then((reactNode) => setFilterComponent(reactNode))
	}, [])

	//console.log('FilterComponent render', filterComponent); // Считаем рендеры пока разрабатываем
	return filterComponent
})

// Хук подписки на изменение значений фильтров в иерархии.
export const useHierarchyFiltersValue = (s: Store) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const rootNode = s.hierarchy.tableNode?.rootNode()

		if (s.hierarchy.isChild && !s.filters.unsub && rootNode?.states.filters.value) {
			const unsub = R.libs.valtio.subscribe(rootNode.states.filters.value, () => {
				R.libs.just.map(s.columnsDefinition, (idx, definition) => {
					const rootState = rootNode.states.filters.value[idx]
					if (rootState) {
						if (!s.filters.state) s.filters.state = {}
						s.filters.state[idx] = { enabled: rootState.enabled, value: rootState.value, defaultValue: rootState.defaultValue }

						const filterResult = definition.filter?.func?.(
							R.libs.valtio.snapshot(s.filters.state[idx]),
							s.originalIds.map((id) => useItem(id, 'snap')).filter((i) => !!i),
							s.hierarchy.tableNode ? R.libs.valtio.snapshot(s.hierarchy.tableNode) : undefined
						)

						if (filterResult) {
							s.filters.state[idx].ids = filterResult.map((i) => i.id)
							s.records = getSortedIds(s)
								.filter((id) => getFilteredIds(s).includes(id))
								.map((id) => ({ id }))
						}
					}
				})
			})
			s.filters.unsub = unsub
		}
	}, [])

	// Отписка при демонтировании таблицы.
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		return () => s.filters.unsub?.()
	}, [])
}

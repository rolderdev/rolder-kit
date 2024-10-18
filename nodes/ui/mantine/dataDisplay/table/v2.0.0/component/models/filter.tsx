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

	s.filtersState = {}
	map(s.columnsDefinition, (idx, definition) => {
		if (s.filtersState) {
			const defaultState = definition.filter?.defaultState
			if (defaultState) {
				// Нужно клонировать, чтобы прокси в декларации колонки не выступал реактивным хранилищем.
				s.filtersState[idx] = { ...omit(defaultState, ['value']), defaultValue: defaultState.value }
			} else s.filtersState[idx] = { enabled: false, value: null, defaultValue: null }

			// Применим функцию, если фильтр включен в дефолтном состоянии.
			if (defaultState?.enabled && definition.filter) {
				const filterResult = definition.filter.func?.(
					R.libs.valtio.snapshot(defaultState),
					items.map((i) => useItem(i.id, 'snap')).filter((i) => !!i),
					s.hierarchy.tableNode ? R.libs.valtio.snapshot(s.hierarchy.tableNode) : undefined
				)

				if (filterResult) {
					s.filtersState[idx].ids = filterResult.map((i) => i.id)
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
			if (s.filtersState) {
				const unsub = R.libs.valtio.subscribeKey(s.filtersState[idx], 'value', () => {
					if (s.filtersState?.[idx]) {
						const filterResult = definition.filter?.func?.(
							R.libs.valtio.snapshot(s.filtersState[idx]),
							s.originalIds.map((id) => useItem(id, 'snap')).filter((i) => !!i)
						)

						if (filterResult) {
							s.filtersState[idx].ids = filterResult.map((i) => i.id)
							s.records = getSortedIds(s)
								.filter((id) => getFilteredIds(s).includes(id))
								.map((id) => ({ id }))
						}
					}
				})
				setUnsubs({ ...unsubs, [idx]: unsub })
			}
		})
	}, [])

	// Отписка при демонтировании таблицы.
	useEffect(() => {
		;() => Object.values(unsubs).forEach((u) => u?.())
	}, [])
}

export const getFilteredIds = (s: Store) => {
	let ids: string[] = s.originalIds
	if (s.filtersState)
		Object.values(s.filtersState).forEach((filterState) => {
			if (filterState.enabled && filterState.ids) ids = filterState.ids.filter((id) => ids.includes(id))
		})
	return ids
}

// Компонента фильтрации.
export const FilterComponent = memo((p: { columnIdx: string; close: () => void }) => {
	const store = useContext(TableContext)

	// Кастомный Suspense.
	const [filterComponent, setFilterComponent] = useState<React.ReactNode | undefined>(undefined)
	useEffect(() => {
		const tableId = store.hierarchy.tableNode?.itemId || R.libs.nanoid(8)
		const template = R.libs.just.get(store.columnsDefinition, [p.columnIdx, 'filter', 'template'])
		const filterState = store.filtersState?.[p.columnIdx]
		if (template)
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

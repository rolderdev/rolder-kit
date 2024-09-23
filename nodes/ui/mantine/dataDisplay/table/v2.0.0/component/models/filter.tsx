/* Модель фильтрации. */

import { memo, useContext, useEffect, useState } from 'react';
import { TableContext } from '../TableProvider';
import getRoodlReactNode from '../funcs/getRoodlReactNode';
import type { Store } from '../store';
import type { FilterState } from '@nodes/table-filter-v0.1.0';
import type { Item } from '@shared/types-v0.1.0';
import useItem from '../funcs/useItem';

export type Filter = {
	template: string;
	defaultState?: FilterState;
	func?: (state: FilterState, items: Item[]) => Item[] | undefined;
};

// Подготовка хранилища.
export const setInitialFiltersState = (s: Store, items: Item[]) => {
	const { map, omit } = R.libs.just;

	s.filtersState = {};
	map(s.columnsDefinition, (idx, definition) => {
		if (s.filtersState) {
			const defaultState = definition.filter?.defaultState;
			if (defaultState) {
				// Нужно клонировать, чтобы прокси в декларации колонки не выступал реактивным хранилищем.
				s.filtersState[idx] = { ...omit(defaultState, ['value']), defaultValue: defaultState.value };
			} else s.filtersState[idx] = { enabled: false, value: null, defaultValue: null };

			// Применим функцию, если фильтр включен в дефолтном состоянии.
			if (defaultState?.enabled && definition.filter) {
				const filterResult = definition.filter.func?.(
					R.libs.valtio.snapshot(defaultState),
					items.map((i) => useItem(i.id, 'snap')).filter((i) => !!i)
				);
				if (filterResult) s.records = filterResult.map((i) => ({ id: i.id }));
			}
		}
	});
};

// Хук подписки на изменение значений фильтров.
export const useFiltersValue = (s: Store, items: Item[]) => {
	useEffect(() => {
		const { subscribeKey, snapshot } = R.libs.valtio;

		let unsubs: Record<string, (() => void) | undefined> = {};

		R.libs.just.map(s.columnsDefinition, (idx, definition) => {
			if (s.filtersState)
				unsubs[idx] = subscribeKey(s.filtersState[idx], 'value', () => {
					if (s.filtersState) {
						const filterResult = definition.filter?.func?.(
							snapshot(s.filtersState[idx]),
							items.map((i) => useItem(i.id, 'snap')).filter((i) => !!i)
						);
						if (filterResult) s.records = filterResult.map((i) => ({ id: i.id }));
					}
				});
		});

		return () => Object.values(unsubs).forEach((u) => u?.());
	}, []);
};

// Компонента фильтрации.
export const FilterComponent = memo((p: { columnIdx: string; close: () => void }) => {
	const store = useContext(TableContext);

	// Кастомный Suspense.
	const [filterComponent, setFilterComponent] = useState<React.ReactNode | undefined>(undefined);
	useEffect(() => {
		const tableId = store.hierarchy.tableNode?.itemId || R.libs.nanoid(8);
		const template = R.libs.just.get(store.columnsDefinition, [p.columnIdx, 'filter', 'template']);
		const filterState = store.filtersState?.[p.columnIdx];
		if (template)
			getRoodlReactNode(store, tableId, template, {
				itemId: tableId,
				columnIdx: p.columnIdx,
				filterState,
				close: p.close,
				level: store.hierarchy.level,
			}).then((reactNode) => setFilterComponent(reactNode));
	}, []);

	//console.log('FilterComponent render', filterComponent); // Считаем рендеры пока разрабатываем
	return filterComponent;
});

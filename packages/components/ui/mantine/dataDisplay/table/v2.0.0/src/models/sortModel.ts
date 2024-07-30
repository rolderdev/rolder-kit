/* Модель сортировки. */

import { sendOutput } from '@packages/port-send';
import type { Store } from '../store/store';

// Устанавливает дефолтное состояние сортировки из схемы колонок.
export const setDefaultSortState = (s: Store) => {
	const defaultSortColumn = s.originalColumns.get().find((i) => typeof i.sort === 'string');
	const direction = defaultSortColumn?.sort;
	if (s.tableProps.sort.enabled.get() && defaultSortColumn?.accessor && typeof direction === 'string') {
		s.sortState.set({ columnAccessor: defaultSortColumn?.accessor, direction });
	} else s.sortState.set(undefined);
};

// Функция для фронт-сортировки.
export const frontSortItems = (s: Store) => {
	let originalItems = s.originalItems.get();
	const sortState = s.sortState.get();

	const sort = s.tableProps.sort.get();
	if (sort.enabled && sort.type === 'frontend' && sortState) {
		originalItems = R.utils.naturalSort(originalItems, sortState.columnAccessor, sortState.direction);
	}

	return originalItems;
};

export const sendSortState = (s: Store) => {
	const sortState = s.sortState.get();
	sendOutput(s.noodlNode.get(), 'sortValue', sortState ? { [sortState.columnAccessor]: sortState.direction } : null);
};

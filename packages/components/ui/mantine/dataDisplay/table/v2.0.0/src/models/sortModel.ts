/* Модель сортировки. */

import { sendOutput, sendSignal } from '@packages/port-send';
import type { Store } from '../store/store';

// Устанавливает дефолтное состояние сортировки из схемы колонок.
export const setDefaultSortState = (s: Store) => {
	if (s.cold.tableProps.sort.enabled.get()) {
		// Возьмем первую колонку с установленным направлением сортировки.
		const defaultSortColumn = s.cold.columnsDefinition.get().find((i) => typeof i.sort === 'string');
		const direction = defaultSortColumn?.sort;
		if (defaultSortColumn?.accessor && typeof direction === 'string') {
			s.sortState.set({ columnAccessor: defaultSortColumn?.accessor, direction });
		} else s.sortState.set(undefined);
		const sortState = s.sortState.get();
		sendOutput(s.noodlNode.get(), 'sortState', sortState ? { [sortState.columnAccessor]: sortState.direction } : null);
	}
};

// Функция для фронт-сортировки.
export const frontSortItems = (s: Store) => {
	let items = s.cold.items.get();
	if (items) {
		const sortState = s.sortState.get();
		if (sortState) {
			// Отсортируем функцией разработчика, если она есть.
			const sortFunc = s.cold.columnsDefinition.get().find((i) => i.accessor === sortState.columnAccessor)?.sortFunc;
			if (sortFunc) items = sortFunc(items, sortState.columnAccessor, sortState.direction);
			else items = R.utils.naturalSort(items, sortState.columnAccessor, sortState.direction);
		}
	}

	return items || [];
};

export const sendSortState = (s: Store) => {
	const sortState = s.sortState.get();
	sendOutput(s.noodlNode.get(), 'sortState', sortState ? { [sortState.columnAccessor]: sortState.direction } : null);
	sendSignal(s.noodlNode.get(), 'sortStateChanged');
};

/* Модель сортировки. */
import type { DataTableSortStatus } from 'mantine-datatable';
import type { TableRecord } from './record';
import type { Store } from '../../node/store';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';

export const setSortState = (s: Store, sortState: DataTableSortStatus<TableRecord>, firstTime?: boolean) => {
	s.sortState = sortState;

	// Отсортируем items, если включена фронтовая сортировка.
	const sort = s.tableProps.sort;
	if (sort.enabled && sort.type === 'frontend') {
		let items = s.records.map((i) => R.items[i.id]).filter((i) => !!i);
		items = R.utils.naturalSort.v1(items, s.sortState.columnAccessor, s.sortState.direction);
		s.records = items.map((i) => ({ id: i.id }));
	}

	// Отправим состояние сортировки в формате удобном для useData.
	sendOutput(s.noodlNode, 'sortState', { [sortState.columnAccessor]: sortState.direction });
	if (!firstTime) sendSignal(s.noodlNode, 'sortStateChanged');
};

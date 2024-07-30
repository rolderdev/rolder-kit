import type { Item } from 'types';
import type { Store } from '../store/store';
import type { DataTableSortStatus } from 'mantine-datatable';

export default function (store: Store, state: DataTableSortStatus<Item>, items?: Item[]) {
	const column = store.getState().columns.find((i) => state.columnAccessor === i.accessor);
	let notSortedItems = Array.from(store.getState().rows.values()).map((i) => i.item as Item);
	const sortedItems = column?.sort?.func?.(notSortedItems.length ? notSortedItems : items || [], state.direction) as Item[];

	store.setState((s) => ({ sort: { ...s.sort, state }, rowIds: sortedItems.map((i) => i.id) }));
}

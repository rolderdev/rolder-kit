import { store, createStoreContext } from '@davstack/store';
import get from 'just-safe-get';
import type { NoodlNode } from '@packages/node';
import type { Item } from 'types';
import type { Props } from '../types';
import { setLibProps, type LibProps } from './models/libPropsModel';
import { setTableProps, type TableProps } from './models/tablePropsModel';
import { type Column, setColumns } from './models/columnModel';
import { setExpansionRows, setItems } from './models/itemModel';

const tableStore = store({
	noodlNode: {} as NoodlNode,
	tableId: '',
	libProps: {} as LibProps,
	tableProps: {} as TableProps,
	columns: [] as Column[],
	items: [] as Item[],
	selectedIds: [] as string[],
	selectedIdsFirstRun: true,
	expansionRows: {} as Record<string, React.ReactNode>,
	expandedIds: [] as string[],
})
	.actions((store) => ({
		// Методы обнолвения состояний. С типизацией не разобрался.
		setLibProps: (p: Props) => setLibProps(store as any, p),
		setTableProps: (p: Props) => setTableProps(store as any, p),
		setColumns: (p: Props) => setColumns(store as any, p.columnsDefinition),
		setItems: (p: Props) => setItems(store as any, p.items),
		resetSelectedItems: () => {
			if (store.selectedIds.get().length) store.selectedIds.set([]);
		},
		setExpansionRows: (p: Props) => setExpansionRows(store as any),
	}))
	.computed((store) => ({
		getValue: (p: { itemId: string; columnIdx: number }) => {
			const items = store.items.get();
			const item = items.find((item) => item.id === p.itemId);
			const getValue = store.columns.use((columns) => columns[p.columnIdx].getValue);
			store.columns.get((columns) =>
				columns[p.columnIdx].accessors?.map((accessor) => {
					get(store.items.use().find((item) => item.id === p.itemId) || {}, accessor);
				})
			);
			return getValue?.(item || {}, items);
		},
	}));

export type Store = typeof tableStore;

export const { useStore, Provider } = createStoreContext(tableStore);

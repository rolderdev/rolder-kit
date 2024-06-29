import { store, createStoreContext } from '@davstack/store';
import type { NoodlNode } from '@packages/node';
import type { Item } from 'types';
import type { Props } from '../types';
import { setLibProps, type LibProps } from './models/libPropsModel';
import { setTableProps, type TableProps } from './models/tablePropsModel';
import { type Column, setColumns } from './models/columnModel';
import { setItems } from './models/itemModel';
import { resetSelectedItems } from './models/multiSelectionModel';
import { setExpansionRows } from './models/expansionModel';

const tableStore = store({
	noodlNode: {} as NoodlNode,
	tableId: '',
	libProps: {} as LibProps,
	tableProps: {} as TableProps,
	columns: [] as Column[],
	items: [] as Item[],
	selectedItems: [] as Item[],
	selectedItemsFirstRun: true,
	expansionRows: {} as Record<string, React.ReactNode>,
	expandedIds: [] as string[],
}).actions((store) => ({
	// Методы обнолвения состояний. С типизацией не разобрался.
	setLibProps: (p: Props) => setLibProps(store as any, p),
	setTableProps: (p: Props) => setTableProps(store as any, p),
	setColumns: (p: Props) => setColumns(store as any, p.columnsDefinition),
	setItems: (p: Props) => setItems(store as any, p.items),
	resetSelectedItems: () => resetSelectedItems(store as any),
	setExpansionRows: (p: Props) => setExpansionRows(store as any),
}));

export type Store = typeof tableStore;

export const { useStore, Provider } = createStoreContext(tableStore);

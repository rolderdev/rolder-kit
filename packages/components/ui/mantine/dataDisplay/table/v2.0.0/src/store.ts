import { store, createStoreContext } from '@davstack/store';
import type { NoodlNode } from '@packages/node';
import type { Item } from 'types';
import type { Props } from '../types';
import { setLibProps, type LibProps } from './models/libPropsModel';
import { setTableProps, type TableProps } from './models/tablePropsModel';
import { type Column, setColumns } from './models/columnModel';
import { setItems } from './models/itemModel';
import { setSelectedItem } from './models/singleSelectionModel';
import { setSelectedItems } from './models/multiSelectionModel';
import { setExpansionRows } from './models/expansionModel';
import { setTemplateCells } from './models/templateCellModel';
import type { TabelScopeStore } from '@packages/table-scope-v0.1.0/src/store';

const tableStore = store({
	noodlNode: {} as NoodlNode,
	tableId: '',
	isChild: false,
	scope: undefined as TabelScopeStore | undefined,
	libProps: {} as LibProps,
	tableProps: {} as TableProps,
	columns: [] as Column[],
	items: [] as Item[],
	selectedItem: null as Item | null,
	selectedItemFirstRun: true,
	selectedItems: [] as Item[],
	selectedItemsFirstRun: true,
	templateCells: {} as Record<number, Record<string, React.ReactNode>>,
	templateCellsReady: false,
	expansionRows: {} as Record<string, React.ReactNode>,
	expandedIds: [] as string[],
})
	.computed((store) => ({
		ready: () => store.templateCellsReady.use(),
	}))
	.actions((store) => ({
		// Методы обнолвения состояний. С типизацией не разобрался.
		setLibProps: (p: Props) => setLibProps(store as any, p),
		setTableProps: (p: Props) => setTableProps(store as any, p),
		setColumns: (p: Props) => setColumns(store as any, p.columnsDefinition),
		setItems: (p: Props) => setItems(store as any, p.items),
		setTemplateCells: () => setTemplateCells(store as any),
		setSelectedItem: (selectedItem: Item) => setSelectedItem(store as any, selectedItem),
		setSelectedItems: (selectedItems: Item[]) => setSelectedItems(store as any, selectedItems),
		setExpansionRows: () => setExpansionRows(store as any),
	}));

export type Store = typeof tableStore;

export const { useStore, Provider } = createStoreContext(tableStore);

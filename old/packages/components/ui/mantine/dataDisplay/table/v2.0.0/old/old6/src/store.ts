import { createStoreContext, store } from '@davstack/store'
import type { NoodlNode } from '@packages/node'
import { sendOutput } from '@packages/port-send'
import type { TabelScopeStore } from '@packages/table-scope-v0.1.0/src/store'
import get from 'just-safe-get'
import type { DataTableSortStatus } from 'mantine-datatable'
import type { Item } from 'types'
import type { Props } from '../types'
import { type Column, setColumns } from './models/columnModel'
import { setExpansionRows } from './models/expansionModel'
import { setItems } from './models/itemModel'
import { type LibProps, setLibProps } from './models/libPropsModel'
import { sendSelectedItems, setSelectedItems } from './models/multiSelectionModel'
import { sendSelectedItem, setSelectedItem } from './models/singleSelectionModel'
import { type TableProps, setTableProps } from './models/tablePropsModel'
import { setTemplateCells } from './models/templateCellModel'

const tableStore = store({
	noodlNode: {} as NoodlNode,
	tableId: '',
	isChild: false,
	level: 0,
	scope: undefined as TabelScopeStore | undefined,
	libProps: {} as LibProps,
	tableProps: {} as TableProps,
	columns: [] as Column[],
	items: [] as Item[],
	templateCells: {} as Record<number, Record<string, React.ReactNode>>,
	templateCellsReady: false,
	selectedItem: null as Item | null,
	selectedItemFirstRun: true,
	selectedItems: [] as Item[],
	selectedItemsFirstRun: true,
	expansionRows: {} as Record<string, React.ReactNode>,
	expandedIds: [] as string[],
	expandedIdsFirstRun: true,
	sortState: {} as DataTableSortStatus<Item>,
})
	.computed((store) => ({
		ready: () => store.templateCellsReady.use(),
	}))
	.actions((store) => ({
		// Методы обнолвения состояний. С типизацией не разобрался.
		setLibProps: (p: Props) => setLibProps(store as any, p),
		setTableProps: (p: Props) => setTableProps(store as any, p),
		setColumns: (p: Props) => setColumns(store as any, p.columnsDefinition),
		setItems: (p: Props) => setItems(store as any, p),
		setTemplateCells: () => setTemplateCells(store as any),
		setSelectedItem: (selectedItem: Item) => setSelectedItem(store as any, selectedItem),
		setSelectedItems: (selectedItems: Item[]) => setSelectedItems(store as any, selectedItems),
		setExpansionRows: () => setExpansionRows(store as any),
	}))
	// Подписка на изменения для отправки в порты.
	// Названия функий не имеют значения, просто для наглядности.
	// fireImmediately - для подачи в порт первый раз, если разработчик подал на вход.
	.effects((store) => ({
		itemsChanged: () =>
			store.selectedItem.onChange((newSelectedItem) => {
				if (store.tableProps.sort.type?.get() === 'frontend') {
					const sortState = store.sortState.get()
					store.items.set(
						R.libs.sort(store.items.get()).by([{ [sortState.direction]: (i: any) => get(i, sortState.columnAccessor) }])
					)
				}
			}),
		selectedItemChanged: () =>
			store.selectedItem.onChange((newSelectedItem) => sendSelectedItem(store as any, newSelectedItem), {
				fireImmediately: true,
			}),
		selectedItemsChanged: () =>
			store.selectedItems.onChange((newSelectedItems) => sendSelectedItems(store as any, newSelectedItems), {
				fireImmediately: true,
			}),
		sortStateChanged: () =>
			store.sortState.onChange(
				(newSortState) => {
					if (store.tableProps.sort.type?.get() === 'frontend') {
						store.items.set(
							R.libs.sort(store.items.get()).by([{ [newSortState.direction]: (i: any) => get(i, newSortState.columnAccessor) }])
						)
					}
					sendOutput(store.noodlNode.get(), 'sortValue', { [newSortState.columnAccessor]: newSortState.direction })
				},
				{
					fireImmediately: true,
				}
			),
	}))

export type Store = typeof tableStore

export const { useStore, Provider } = createStoreContext(tableStore)

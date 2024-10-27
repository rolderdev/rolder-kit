import type { NoodlNode } from '@packages/node'
import isEqual from 'lodash.isequal'
import type { DataTableSortStatus } from 'mantine-datatable'
import { nanoid } from 'nanoid'
import { createContext } from 'react'
import type { Item } from 'types'
import { createStore } from 'zustand'
import type { Props } from '../../types'
import { type Column, getColumns } from '../models/columnModel'
import { type LibProps, getLibProps } from '../models/libPropsModel'
import type { Row } from '../models/rowMoldel'
import { type TableProps, getTableProps } from '../models/tablePropsModel'

export type State = {
	noodlNode: NoodlNode
	tableId: string
	fetching: boolean
	libProps: LibProps
	tableProps: TableProps
	columns: Column[] // С колонками удобнее работаь через простой массив.
	rows: Map<string, Row> // Map - удобнее записывать и брать, забивая на порядок.
	items: Item[]
	rowIds: string[] // Массив id, чтобы не передавать часто меняющиеся items в таблицу и управлять порядком строк.
	/* selectedRowId?: string;
	selectedRowFirstRun: boolean;
	selectedRowIds: string[];
	selectedRowsFirstRun: boolean;
	expandedRowIds: string[];
	expandedRowsFirstRun: boolean;
	sort?: {
		state?: {
			columnAccessor: string;
			direction: 'asc' | 'desc';
		};
	}; */
	startTime: number
}

export type Store = ReturnType<typeof createTableStore>

export const createTableStore = (p: Props) =>
	createStore<State>()(() => ({
		noodlNode: p.noodlNode,
		tableId: nanoid(8),
		fetching: true,
		libProps: getLibProps(p),
		tableProps: getTableProps(p),
		columns: getColumns(p.columnsDefinition || []),
		rows: new Map(),
		items: [],
		rowIds: p.items?.map((i) => i.id) || [],
		/* selectedRowFirstRun: true,
		selectedRowIds: [],
		selectedRowsFirstRun: true,
		expandedRowIds: [],
		expandedRowsFirstRun: true,
		sort: {
			state: (() => {
				const defaultSortColumn = p.columnsDefinition?.find((i) => i.sort?.default);
				if (defaultSortColumn && defaultSortColumn.accessor && defaultSortColumn.sort?.default)
					return {
						columnAccessor: defaultSortColumn.accessor,
						direction: defaultSortColumn.sort.default,
					};
				else return;
			})() as DataTableSortStatus<Item> | undefined,
		}, */
		startTime: performance.now(),
	}))

export const TableContext = createContext<Store | null>(null)

// Метод для выбора строки. itemIds нужны для первичной проврке, когда еще нет rows.
/* export const setSelectedRowId = (store: Store, itemIds: string[], selectedId?: string) => {
	const unselectable = store.getState().tableProps.selection.single.unselectable;
	if (selectedId) {
		// Не назначаем того, чго нет и не будем изменять состояние, когда не нужно.
		if (itemIds.includes(selectedId))
			if (selectedId !== store.getState().selectedRowId) store.setState({ selectedRowId: selectedId });
			else if (unselectable) store.setState({ selectedRowId: undefined }); // Для отмены по нажатию.
	} else if (unselectable) store.setState({ selectedRowId: undefined }); // Для отмены извне.
};

// Метод для выбора строк.
export const setSelectedRowIds = (store: Store, items: Item[], selectedItems: Item[]) => {
	// Добавим только те, которые есть в items, чтобы разработчик мог ошибиться без последствий.
	const newSelectedRowIds = selectedItems.map((i) => i.id).filter((i) => items.map((i) => i.id).includes(i));

	// Не будем менять состяние, если нет изменений.
	if (!isEqual(store.getState().selectedRowIds, newSelectedRowIds)) store.setState({ selectedRowIds: newSelectedRowIds });
};

// Метод для разворачивания строк.
export const setExpandedRowIds = (store: Store, items: Item[], expandedItems: Item[]) => {
	// Добавим только те, которые есть в items, чтобы разработчик мог ошибиться без последствий.
	const newExpandedRowIds = expandedItems.map((i) => i.id).filter((i) => items.map((i) => i.id).includes(i));

	// Не будем менять состяние, если нет изменений.
	if (!isEqual(store.getState().expandedRowIds, newExpandedRowIds)) store.setState({ expandedRowIds: newExpandedRowIds });
};
 */

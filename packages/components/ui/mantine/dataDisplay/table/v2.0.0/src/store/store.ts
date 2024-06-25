import { createContext } from 'react';
import { createStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { NoodlNode } from '@packages/node';
import type { Item } from 'types';
import type { Props } from '../../types';
import { getLibProps, type LibProps } from '../models/libPropsModel';
import { getTableProps, type TableProps } from '../models/tablePropsModel';
import { getColumns, type Column } from '../models/columnModel';
import type { Row } from '../models/rowMoldel';
import isEqual from 'lodash.isequal';
import type { DataTableSortStatus } from 'mantine-datatable';

export type State = {
	noodlNode: NoodlNode;
	tableId: string;
	fetching: boolean;
	libProps: LibProps;
	tableProps: TableProps;
	columns: Column[]; // С колонками удобнее работаь через простой массив.
	rows: Map<string, Row>; // Map - удобнее записывать и брать, забивая на порядок.
	rowIds: string[]; // Массив id, чтобы не передавать часто меняющиеся items в таблицу и управлять порядком строк.
	selectedRowId?: string;
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
	};
};

export type Store = ReturnType<typeof createTableStore>;

export const createTableStore = (p: Props) =>
	createStore<State>()(
		//@ts-ignore
		subscribeWithSelector(() => ({
			noodlNode: p.noodlNode,
			tableId: nanoid(8),
			fetching: true,
			libProps: getLibProps(p),
			tableProps: getTableProps(p),
			columns: getColumns(p.columnsDefinition || []),
			rows: new Map(),
			rowIds: p.items?.map((i) => i.id) || [],
			selectedRowFirstRun: true,
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
			},
		}))
	);

export const TableContext = createContext<Store | null>(null);

// Метод для выбора строки. itemIds нужны для первичной проврке, когда еще нет rows.
export const setSelectedRowId = (store: Store, itemIds: string[], selectedId?: string) => {
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

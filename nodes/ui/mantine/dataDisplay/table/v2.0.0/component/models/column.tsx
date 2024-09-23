/* Модель колонки. */

import type { DataTableColumn } from 'mantine-datatable';
import type { Item } from '@shared/types-v0.1.0';
import Node from '@nodes/use-data-v2.0.0/component/Node';
import type { Props } from '../../node/definition';
import type { TableRecord } from './record';
import Cell from '../renders/Cell';
import ExpanderCell from '../renders/ExpanderCell';
import { FilterComponent, type Filter } from './filter';
import type { Snap, Store } from '../store';

// Наш тип данных декларации колонки.
export type ColumnDefinition = Partial<DataTableColumn<TableRecord>> & {
	type: 'accessor' | 'getValue' | 'custom' | 'template';
	getValue?: (itemSub: Item, itemsSnap: Item[], nodeSub: Node | undefined) => string | number | undefined;
	custom?: (
		itemSub: Item,
		itemsSnap: Item[],
		nodeSub: Node | undefined
	) => { watchItems: Item[]; getValue: ColumnDefinition['getValue'] };
	template?: string;
	sort?: true | 'asc' | 'desc';
	sortPath: string;
	filter?: Filter;
};
export type ColumnsDefinition = Record<string, ColumnDefinition>;
export type Column = ColumnDefinition & DataTableColumn<TableRecord> & { idx: string };

export const setColumnsDefinition = (p: Props, s: Store) => {
	const { has, set, map } = R.libs.just;

	p.columnsDefinition?.map((columnDefinition, idx) => set(s.columnsDefinition, `${idx}`, columnDefinition));
	map(s.columnsDefinition, (idx) => {
		if (!has(p.columnsDefinition, idx)) delete s.columnsDefinition[idx];
	});
};

// Конвертация декларации в колонку для библиотеки.
export const getColumns = (snap: Snap) =>
	Object.values(snap.columnsDefinition)
		.map(
			(i, idx) =>
				({
					...i,
					idx: `${idx}`,
					// Нужно установить sortPath, когда включена сортировка, т.к. библиотека не хранит в состоянии сортировки номер колонки.
					accessor: i.accessor || i.sortPath || `${idx}`,
					sortable: i.sort ? true : false,
				} satisfies Column)
		)
		.map(
			(i) =>
				({
					...i,
					render: (record) =>
						snap.tableProps.expansion.enabled && i.idx === '0' ? (
							<ExpanderCell columnIdx={i.idx} id={record.id} />
						) : (
							<Cell columnIdx={i.idx} id={record.id} />
						),
					filter: i.filter ? (f) => <FilterComponent columnIdx={i.idx} close={f.close} /> : undefined,
					filtering: i.filter ? snap.filtersState?.[i.idx].enabled : false,
				} satisfies DataTableColumn<TableRecord>)
		);

/* Модель колонки. */

import type { DataTableColumn } from 'mantine-datatable';
import type { Item } from '@shared/types-v0.1.0';
import Node from '@nodes/use-data-v2.0.0/component/Node';
import type { Props } from '../../node/definition';
import type { TableRecord } from './record';
import Cell from '../renders/Cell';
import ExpanderCell from '../renders/ExpanderCell';

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
};
export type ColumnsDefinition = Record<string, ColumnDefinition>;
export type Column = ColumnDefinition & DataTableColumn<TableRecord> & { idx: string };

export const setColumnsDefinition = (p: Props) => {
	const { has, set, map } = R.libs.just;

	p.columnsDefinition?.map((columnDefinition, idx) => set(p.store.columnsDefinition, `${idx}`, columnDefinition));
	map(p.store.columnsDefinition, (idx) => {
		if (!has(p.columnsDefinition, idx)) delete p.store.columnsDefinition[idx];
	});
};

// Конвертация декларации в колонку для библиотеки.
export const getColumns = (columnsDefinition: ColumnsDefinition, expansionEnabled: boolean) =>
	Object.values(columnsDefinition)
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
						expansionEnabled && i.idx === '0' ? (
							<ExpanderCell columnIdx={i.idx} id={record.id} />
						) : (
							<Cell columnIdx={i.idx} id={record.id} />
						),
				} satisfies DataTableColumn<TableRecord>)
		);

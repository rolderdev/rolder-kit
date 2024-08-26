/* Модель колонки. */

import type { DataTableColumn } from 'mantine-datatable';
import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../../types';
import Render from '../renders/Render';
import type { TableRecord } from './recordModel';
import ExpansionRender from '../renders/ExpansionRender';

// Наш тип данных декларации колонки.
export type ColumnDefinition = Partial<DataTableColumn<TableRecord>> & {
	type: 'accessor' | 'getValue' | 'template';
	getValue?: (item: Readonly<Item>) => string | number;
	template?: string;
};
export type ColumnsDefinition = Record<string, ColumnDefinition>;
export type Column = ColumnDefinition & DataTableColumn<TableRecord> & { idx: string };

export const setColumnsDefinition = (p: Props) => {
	const { has, set, map } = R.libs.just;

	p.columnsDefinition.map((columnDefinition, idx) => set(p.store.columnsDefinition, `${idx}`, columnDefinition));
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
					accessor: i.accessor || `${idx}`,
				} satisfies Column)
		)
		.map(
			(i) =>
				({
					...i,
					render: (record) =>
						expansionEnabled && i.idx === '0' ? (
							<ExpansionRender column={i} id={record.id} />
						) : (
							<Render column={i} id={record.id} />
						),
				} satisfies DataTableColumn<TableRecord>)
		);

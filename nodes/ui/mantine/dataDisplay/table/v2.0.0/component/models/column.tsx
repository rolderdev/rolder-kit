/* Модель колонки. */

import type Node from '@nodes/use-data-v2.0.0/component/Node'
import type { Item } from '@shared/types-v0.1.0'
import type { DataTableColumn } from 'mantine-datatable'
import type { Props } from '../../node/definition'
import Cell from '../renders/Cell'
import ExpanderCell from '../renders/ExpanderCell'
import type { Snap, Store } from '../store'
import { type Filter, FilterComponent } from './filter'
import type { TableRecord } from './record'
import type { Sort } from './sort'

// Наш тип данных декларации колонки.
export type ColumnDefinition = Partial<DataTableColumn<TableRecord>> & {
	type: 'accessor' | 'getValue' | 'custom' | 'template'
	getValue?: (itemSub: Item, itemsSnap: Item[], nodeSub: Node | undefined) => string | number | undefined
	custom?: (
		itemSub: Item,
		itemsSnap: Item[],
		nodeSub: Node | undefined
	) => { watchItems: Item[]; getValue: ColumnDefinition['getValue'] }
	template?: string
	sort?: Sort
	filter?: Filter
}
export type ColumnsDefinition = Record<string, ColumnDefinition>
export type Column = ColumnDefinition & DataTableColumn<TableRecord> & { idx: string }

export const setColumnsDefinition = (p: Props, s: Store) => {
	const { has, set, map } = R.libs.just

	p.columnsDefinition?.map((columnDefinition, idx) => set(s.columnsDefinition, `${idx}`, columnDefinition))
	map(s.columnsDefinition, (idx) => {
		if (!has(p.columnsDefinition, idx)) delete s.columnsDefinition[idx]
	})
}

// Конвертация декларации в колонку для библиотеки.
export const getColumns = (snap: Snap) =>
	Object.values(snap.columnsDefinition)
		.map(
			(i, idx) =>
				({
					...i,
					idx: `${idx}`,
					// Нужно установить sortPath, когда включена сортировка, т.к. библиотека не хранит в состоянии сортировки номер колонки.
					accessor: i.accessor || i.sort?.sortPath || `${idx}`,
					sortable: i.sort ? true : false,
				}) satisfies Column
		)
		.map(
			(i) =>
				({
					...i,
					// Вымученная хитроть с разделителем. Добавляет разделитель только последней таблице в равернутой ветке ирерахии. Работает так:
					// 	В классе row полностью отключается разделитель для expansion ячейки.
					//  Таблица убирает разделитель под последней строкой, мы его возвращаем но с такими условиями:
					//  	Для рутовой таблицы ничего не меняем, для детей:
					//			Expansion выключен. Обычно это вторая таблица с каким то товарами, на это ставка. Рисуем разделитель.
					//			Expansion включен. Если последняя строка не развернута - рисуем, иначе нет.
					cellsStyle: () => {
						const style = {
							borderBottom: 'calc(0.0625rem * var(--mantine-scale)) solid var(--mantine-datatable-row-border-color)',
						}
						if (snap.hierarchy.isChild && snap.libProps.withRowBorders) {
							if (snap.tableProps.expansion.enabled) return style
							else if (!snap.expandedIds[R.libs.just.last(snap.records.map((i) => i.id))]) return style
						}
						return
					},
					render: (record) =>
						snap.tableProps.expansion.enabled && i.idx === '0' ? (
							<ExpanderCell columnIdx={i.idx} id={record.id} />
						) : (
							<Cell columnIdx={i.idx} id={record.id} />
						),
					filter: i.filter ? (f) => <FilterComponent columnIdx={i.idx} close={f.close} /> : undefined,
					filtering: i.filter ? snap.filtersState?.[i.idx].enabled : false,
				}) satisfies DataTableColumn<TableRecord>
		)

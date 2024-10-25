/* Модель колонки. */

import type Node from '@nodes/use-data-v2.0.0/component/Node'
import type { Item } from '@shared/types-v0.1.0'
import type { DataTableColumn } from 'mantine-datatable'
import type { Props } from '../../node/definition'
import type { TableRecord } from './record'
import Cell from '../renders/Cell'
import ExpanderCell from '../renders/ExpanderCell'
import type { Store } from '../store'
import type { Sort } from './sort'
import { type Filter, FilterComponent } from './filter'

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
export type Column = DataTableColumn<TableRecord> &
	Pick<ColumnDefinition, 'type' | 'getValue' | 'template' | 'custom' | 'sort'> & { idx: string; filterDef?: Filter }

// Создание и обновление колонок. В колонках есть функции, а valtio не умеет их сравнивать.
// Опытным путем было вяснено, что ref для каждой колонки и ручное сравнение лучшая комбинация для точечной реактивности.
export const setColumns = (p: Props, s: Store) => {
	const { map, compare } = R.libs.just

	// Создание и обновление.
	p.columnsDefinition?.forEach((columnDefinition, idx) => {
		const newColumn = getColumn(s, columnDefinition, idx)
		if (s.columns[idx]) {
			if (!compare(s.columns[idx], newColumn)) s.columns[idx] = R.libs.valtio.ref(newColumn)
		} else s.columns[idx] = R.libs.valtio.ref(newColumn)
	})

	// Удаление.
	map(s.columns, (idx) => {
		if (!p.columnsDefinition?.[Number.parseInt(idx)]) delete s.columns[idx]
	})
}

// Конвертация декларации в колонку для библиотеки.
const getColumn = (s: Store, columnDefinition: ColumnDefinition, idx: number) =>
	({
		...columnDefinition,
		idx: `${idx}`,
		// Нужно установить sortPath, когда включена сортировка, т.к. библиотека не хранит в состоянии сортировки номер колонки.
		accessor: columnDefinition.accessor || columnDefinition.sort?.sortPath || `${idx}`,
		sortable: !!columnDefinition.sort,
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

			if (s.hierarchy?.isChild && s.libProps.withRowBorders) {
				if (s.tableProps.expansion.enabled) return style
				if (!s.expandedIds[R.libs.just.last(s.records.map((i) => i.id))]) return style
			}
			return
		},
		render: (record) =>
			s.tableProps.expansion.enabled && idx === 0 ? (
				<ExpanderCell tableId={s.tableId} columnIdx={`${idx}`} id={record.id} />
			) : (
				<Cell tableId={s.tableId} columnIdx={`${idx}`} id={record.id} />
			),
		filterDef: columnDefinition.filter,
		filter: columnDefinition.filter
			? (f) => <FilterComponent tableId={s.tableId} columnIdx={`${idx}`} close={f.close} />
			: undefined,
		filtering: columnDefinition.filter ? s.filters.state?.[idx]?.enabled : false,
	}) satisfies Column

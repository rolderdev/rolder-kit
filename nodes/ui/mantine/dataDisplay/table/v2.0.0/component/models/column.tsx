/* Модель колонки. */

import type Node from '@nodes/use-data-v2.0.0/component/Node'
import type { Item } from '@shared/types-v0.1.0'
import type { DataTableColumn } from 'mantine-datatable'
import type { Props } from '../../node/definition'
import Cell from '../renders/Cell'
import ExpanderCell from '../renders/ExpanderCell'
import type { Store } from '../store'
import { type Filter, FilterComponent } from './filter'
import type { TableRecord } from './record'
import type { Sort } from './sort'

// Наш тип данных декларации колонки.
export type ColumnDefinition = Partial<DataTableColumn<TableRecord>> & {
	id: string
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
	Pick<ColumnDefinition, 'id' | 'type' | 'getValue' | 'template' | 'custom' | 'sort'> & { filterDef?: Filter }

// Создание и обновление колонок. В колонках есть функции, а valtio не умеет их сравнивать.
// Опытным путем было вяснено, что ref для каждой колонки и ручное сравнение лучшая комбинация для точечной реактивности.
export const setColumns = (p: Props, s: Store) => {
	// Создание и обновление.
	if (p.columnsDefinition) {
		for (const [idx, definition] of p.columnsDefinition.entries()) {
			const newColumn = getColumn(s, definition, idx === 0)
			if (s.columns[definition.id]) {
				if (!R.libs.just.compare(s.columns[definition.id], newColumn)) s.columns[definition.id] = R.libs.valtio.ref(newColumn)
			} else s.columns[definition.id] = R.libs.valtio.ref(newColumn)
		}

		// Удаление.
		for (const id of Object.keys(s.columns)) {
			if (!p.columnsDefinition.map((i) => i.id).includes(id)) delete s.columns[id]
		}
	}
}

// Конвертация декларации в колонку для библиотеки.
const getColumn = (s: Store, definition: ColumnDefinition, isFirst: boolean) =>
	({
		...definition,
		// Нужно установить sortPath, когда включена сортировка, т.к. библиотека не хранит в состоянии сортировки номер колонки.
		accessor: definition.accessor || definition.sort?.sortPath || `${definition.id}`,
		sortable: !!definition.sort,
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
			s.tableProps.expansion.enabled && isFirst ? (
				<ExpanderCell tableId={s.tableId} columnId={definition.id} id={record.id} />
			) : (
				<Cell tableId={s.tableId} columnId={definition.id} id={record.id} isFirst={isFirst} />
			),
		filterDef: definition.filter,
		filter: definition.filter
			? (f) => <FilterComponent tableId={s.tableId} columnId={definition.id} close={f.close} />
			: undefined,
		filtering: definition.filter?.defaultState?.enabled,
	}) satisfies Column

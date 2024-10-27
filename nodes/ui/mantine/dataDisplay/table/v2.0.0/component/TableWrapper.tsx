/* Обертка для таблицы. Готовит все для таблицы по данным, что прилетают извне - props, сигналы, изменения в иерархии useData. */

import { forwardRef, useImperativeHandle, useMemo } from 'react'
import type { Props } from '../node/definition'
import Table from './Table'
import { setExpandedIds } from './models/expansion'
import { useFiltersValue, useHierarchyFiltersValue } from './models/filter'
import { setSelectedIds, useHierarchySelection } from './models/multiSelection'
import { resetSelectedId, setSelectedId, useHierarhySingleSelection } from './models/singleSelection'
import { useHierarchySortState } from './models/sort'
import { handleStore } from './store'

// Стили библиотеки.
import 'mantine-datatable/styles.css'

export default forwardRef((p: Props, ref) => {
	// Создадим id таблицы, сохранив его одним для всего жизненного цикла.
	const tableId = useMemo(() => R.libs.nanoid(8), [])

	// Создадим/обновим реактивное хранилище. Здесь зашит основной процесс.
	const s = handleStore(p, tableId)

	// Подписка на состояние единичного выбора в иерархии.
	useHierarhySingleSelection(s)

	// Подписка на состояние мульти-выбора в иерархии.
	useHierarchySelection(s)

	// Подписка на состояние сортировки в иерархии.
	useHierarchySortState(s)

	// Подписка на состояние фильтров.
	useFiltersValue(s)
	// Подписка на состояние фильтров в иерархии.
	useHierarchyFiltersValue(s)

	// Входящие сигналы.
	useImperativeHandle(
		ref,
		() => ({
			setSelectedItem: (p: Props) => p.selectedItem && setSelectedId(s, p.selectedItem.id),
			resetSelectedItem: () => resetSelectedId(s),
			setSelectedItems: (p: Props) =>
				p.selectedItems &&
				setSelectedIds(
					s,
					s.records.filter((i) => p.selectedItems?.map((i) => i.id).includes(i.id))
				),
			resetSelectedItems: () => setSelectedIds(s, []),
			setExpandedItems: (p: Props) =>
				p.expandedItems &&
				setExpandedIds(
					s,
					p.expandedItems.map((i) => i.id)
				),
			expandAll: () =>
				p.items &&
				setExpandedIds(
					s,
					p.items.map((i) => i.id)
				),
			collapseAll: () => setExpandedIds(s, []),
		}),
		[s, p.items]
	)

	//console.log('Table wrapper', tableId)
	// Wrapper запускается на каждый чих. Table обернут в memo и берет только tableId.
	// Это означает, что таблица не реагирует на прилетающие props.
	return <Table tableId={tableId} />
})

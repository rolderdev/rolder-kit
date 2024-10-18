/* Провайдер. Отделяет одну таблицу от другой. Устанавливает первичное состояние. Обслуживает внешние сигналы. */

import { getCompProps } from '@packages/get-comp-props'
import { sendOutput } from '@packages/port-send'
import { useTableScopeStore } from '@packages/table-scope-v0.1.0/src/store'
import { nanoid } from 'nanoid'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import TableController from './src/TableController'
import { getColumns } from './src/models/columnModel'
import { getItems } from './src/models/itemModel'
import { getLibProps } from './src/models/libPropsModel'
import { getTableProps } from './src/models/tablePropsModel'
import { Provider, type Store } from './src/store'
import type { Props } from './types'

// Стили загружаем здесь, чтобы разные TableInstance использовали уже загржунный css.
import '@mantine/core/styles/Table.css'
import 'mantine-datatable/styles.css'

export default forwardRef((props: Props, ref) => {
	// Даем разработчику извращаться, если он смелый.
	const p: Props = getCompProps(props)
	// Отменяем все, если нет колонок.
	if (!p.columnsDefinition?.length) return

	// Внешние сигналы. TableController возвращает store через useImperativeHandle.
	// Раз мы можем вытянуть сюда store, то можно было бы использовать эту технику для реализации TableController здесь,
	// но так получается более читабельный код.
	const tableControllerRef = useRef<{ store: Store }>(null)
	useImperativeHandle(
		ref,
		() => ({
			resetSelectedItem() {
				const store = tableControllerRef.current?.store
				// Сбрасываем только если уже не сброшено.
				if (store?.selectedItem.get()) store.selectedItem.set(null)
			},
			resetSelectedItems() {
				const store = tableControllerRef.current?.store
				// Сбрасываем только если уже не сброшено.
				if (store?.selectedItems.get().length) {
					store.setSelectedItems([])
					// Установим состояние выбора для всей иерархии, если есть TableScope.
					// Здесь мы устанавливаем TableScope, useSelectedItems в TableController использует его.
					const scopeDbClass = store.tableProps.scope?.get((s) => s?.dbClass)
					if (scopeDbClass) store.scope.get()?.setMultiSelection(store.tableId.get(), scopeDbClass, [])
				}
			},
		}),
		[]
	)

	// Определяем дочерняя ли таблица и тянем tableId, если он был создан при генерации расширяемых строк в родительской таблице,
	// иначе сгенерируем tableId.
	const { tableId, isChild } = useMemo(
		() => ({
			tableId: props.noodlNode.nodeScope.componentOwner.itemId || nanoid(8),
			isChild: props.noodlNode.nodeScope.componentOwner.itemId ? true : false,
		}),
		[]
	)

	// Подключим TableScope.
	const tableScopeStore = useTableScopeStore()
	// Вычислим первичное состояние выбранных строк. TableScope важнее локально поданных selectedItems.
	const selectedItems = p.scopeDbClass
		? p.selectedItems || tableScopeStore?.getSelectedItems(tableId, p.scopeDbClass) || []
		: p.selectedItems || []

	useEffect(() => {
		// Если TableScope есть и он включен.
		if (tableScopeStore && p.scopeDbClass) {
			// Если это корень, то нужно инициализировать иерархию и установить уровень в 0.
			if (!isChild) {
				// Инициализируем иерархию данных таблиц, если они есть при первом проходе.
				if (p.items) tableScopeStore.setHierarchy(tableId, p.items)
				// Отправим один раз в порт уровень таблицы.
				sendOutput(props.noodlNode, 'level', 0)

				// Если это дочернаяя таблица, нужно установить уровнь.
				// Уровень нужен, чтобы разработчик мог запрограммировать разное поведение подтаблиц.
			} else {
				const level = tableScopeStore.hierarchy.get((s) => s?.find((i) => i.data.id === tableId)?.depth)
				if (level) {
					tableControllerRef.current?.store.level.set(level)
					sendOutput(props.noodlNode, 'level', level)
				}
			}
		}
	}, [])

	// Найдем дефолтную сортировку
	const defaultSortColumn = p.columnsDefinition.find((i) => i.sort === 'asc' || i.sort === 'desc')

	//console.log('TableProvider run'); // Считаем запуски пока разрабатываем
	return (
		<Provider
			// Первичное состояние и установка дефолтов. Здесь релизуется сценарий, когда все, что нужно для отрисовки известно сразу.
			initialState={{
				noodlNode: p.noodlNode,
				tableId,
				isChild,
				scope: tableScopeStore,
				libProps: getLibProps(p, isChild),
				tableProps: getTableProps(p),
				columns: getColumns(p.columnsDefinition),
				items: getItems(p),
				templateCellsReady: !p.columnsDefinition.some((i) => i.type === 'template'),
				selectedItem: p.selectedItem || null,
				selectedItemFirstRun: p.selectedItem ? true : false,
				selectedItems,
				selectedItemsFirstRun: selectedItems.length ? true : false, // Фиксируем, что есть изначально выбранные items.
				expandedIds: p.expandedItems?.map((i) => i.id) || [],
				expandedIdsFirstRun: p.expandedItems?.length ? true : false,
				sortState: defaultSortColumn
					? { columnAccessor: defaultSortColumn.accessor, direction: (defaultSortColumn.sort as 'asc' | 'desc') || 'asc' }
					: undefined,
			}}
		>
			<TableController {...p} ref={tableControllerRef} />
		</Provider>
	)
})

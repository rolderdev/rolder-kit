import { useShallowEffect } from '@mantine/hooks'
import { nanoid } from 'nanoid'
import { useEffect, useMemo, useState } from 'react'
import type { Props, TableState } from '../../types'
import getColumn from '../funcs/getColumn'
import getLibState from './getLibState'

export default function (p: Props) {
	// useMemo с пустыми зависимостями создаст tableId один раз.
	const tableId = useMemo(() => nanoid(8), [])
	// Разберем props
	const { noodlNode, columnsDefinition, items } = p
	// Подготовим дефолты, обработав входящие порты. Оптимизируем, не вычисляя дефолты, когда порты не изменились.
	const libState = useMemo(() => getLibState(p), [p])
	// Создадим состояние таблицы, задав первичное состояние, которое сразу вернется в Table для первого рендера.
	// Это состояние принимает параметры, которые заданы с монтированием.
	const [tableState, setTableState] = useState<TableState>({
		noodlNode,
		tableId,
		libState,
		fetching: true,
		columns: [],
		items: [],
		onRowClickFunc: p.onRowClickFunc,
		selection: {
			single: { enabled: p.singleSelection || false, unselectable: p.unselectable || false, selectedItem: p.selectedItem },
			multi: { enabled: p.multiSelection || false, selectedItems: p.selectedItems || [] },
		},
	})

	// Реактивность на порты
	useShallowEffect(() => {
		console.log('useShallowEffect')
		// Ждем, когда параметры придут с портов. Это место задает паттерн - пока разработчик не подал items и схему колонок,
		// таблица показывает анимацию загрузки.
		if (items && columnsDefinition) {
			// useEffect не умеет async await
			Promise.all(
				columnsDefinition.map(async (columnDefinition) => getColumn(noodlNode, tableId, p.onRowClick, columnDefinition, items))
			).then((columns) => {
				// Установим новое состояние, тригернув таблицу
				setTableState((s) => ({
					...s,
					fetching: false,
					columns,
					items,
					selection: {
						single: { enabled: p.singleSelection || false, unselectable: p.unselectable || false, selectedItem: p.selectedItem },
						multi: { enabled: p.multiSelection || false, selectedItems: p.selectedItems || [] },
					},
				}))
			})
		}
	}, [columnsDefinition, items])

	// if (items && columnsDefinition) {
	// 	Promise.all(
	// 		columnsDefinition.map(async (columnDefinition) => getColumn(noodlNode, tableId, p.onRowClick, columnDefinition, items))
	// 	).then(async (columns) => {
	// 		//const items = p.items || [];
	// 		// Создаем ноды для разворачивания
	// 		/* if (p.expansion) {
	// 			// Создадим разворачиваемы строки. Нужно подавать и развернутые строки с порта, чтобы первичное состояние
	// 			// было синхронно между tableState.expendedRowsIds и p.expandedItems и хука ниже не создавала лишний рендер
	// 			// В tableState еще нет records, передаем p.items
	// 			await updateExpansionRows(tableState, items, p.expandedItems?.map((i) => i.id) || []);
	// 		} */
	// 		// Запишем состояние после создания нод
	// 		/* setTableState((s) => {
	// 			s.fetching = false;
	// 			s.columns = columns;
	// 			s.records = items;
	// 			// Единичный выбор
	// 			// Если задана функция, разработчик сам управляет, иначе включаем поведение для единичного выбора
	// 			s.onRowClick = ({ record }) =>
	// 				p.onRowClickFunc
	// 					? p.onRowClickFunc(record, items)
	// 					: s.selection.single.enabled
	// 					? setSelectedRecord(p.noodlNode, s.selection.single, setTableState, record)
	// 					: undefined;
	// 			return s;
	// 		}); */
	// 		// Если это первый рендер, снимем флаг, позволяя хукам обрабатывать состояние таблицы
	// 		// Так же отправим на выход состояния для первичного соответсвия вход-выход.
	// 		// Так разработчик будет ждать предсказуемого поведение - подал на вход, получил то же на выход.
	// 		// Но не подаем сигналы изменений состояния, ведь это первый рендер, ничего еще не менялось
	// 		/* if (firstRender) {
	// 			setFirstRender(false);
	// 			// Разворачивание. Используем местные items и expendedRowsIds из первичного состояния
	// 			sendOutput(
	// 				tableState.noodlNode,
	// 				'expandedItems',
	// 				items.filter((i) => tableState.expendedRowsIds.includes(i.id))
	// 			);
	// 		} */
	// 	});
	// }

	return tableState
}

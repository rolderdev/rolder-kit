/* Управляющая компонента. Управляет состояние дочерней TableInstance. */

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { getCompProps } from '@packages/get-comp-props';
import type { Props } from './types';
import { TableContext, createTableStore, setExpandedRowIds, setSelectedRowId, setSelectedRowIds } from './src/store/store';
import { setLibProps } from './src/models/libPropsModel';
import { setTableProps } from './src/models/tablePropsModel';
import { setColumns } from './src/models/columnModel';
import { setRows } from './src/models/rowMoldel';
import setRowsReady from './src/subscribers/setRowsReady';
import sendSelectedRow from './src/subscribers/sendSelectedRow';
import sendSelectedRows from './src/subscribers/sendSelectedRows';
import sendExpandedRows from './src/subscribers/sendExpandedRows';
import frontSort from './src/subscribers/frontSort';
import TableInstance from './src/TableInstance';

// Стили загружаем здесь, чтобы разные TableInstance использовали уже загржунный css.
import '@mantine/core/styles/Table.css';
import 'mantine-datatable/styles.css';

export default forwardRef((props: Props, ref) => {
	// Даем разработчику извращаться, если он смелый.
	const p: Props = getCompProps(props);

	// Отменяем все, если нет колонок.
	if (!p.columnsDefinition?.length) {
		R.libs.mantine?.MantineError('Системная ошибка!', 'No columns definition.');
		return;
	}

	// Создаем хранилище состояния таблицы. Запускаетя один раз.
	const store = useRef(
		useMemo(() => {
			const store = createTableStore(p);
			if (p.items) {
				// Если нет кастомных ячеек и расширяемых строк, сразу устанавливаем строки и убираем анимацию.
				if (!p.columnsDefinition?.some((i) => i.type === 'template') && !p.expansion) {
					setRows(store, p.items);
					store.setState({ fetching: false });
				}
				// Отсортируем строки, если есть дефолтная сортирвка.
				const sortState = store.getState().sort?.state;
				if (sortState) frontSort(store, sortState);
			}
			return store;
		}, [])
	).current;

	// Реактивность на изменение портов.
	useEffect(() => {
		setLibProps(store, p);
		setTableProps(store, p);
		setColumns(store, p.columnsDefinition || []);
		if (p.items) {
			setRows(store, p.items);
			// Уберем анимацию, если это первая загрузка и нет кастомизаций.
			if (!p.columnsDefinition?.some((i) => i.type === 'template') && !p.expansion && store.getState().fetching)
				store.setState({ fetching: false });
			// Установим выбранную строку с порта, в том числе и первый раз. Это не порождает доп. рендер.
			// Не будем гонять функцию, если не включено.
			if (store.getState().tableProps.selection.single.enabled)
				setSelectedRowId(
					store,
					p.items.map((i) => i.id),
					p.selectedItem?.id
				);
			// Выбранные строки с порта.
			if (store.getState().tableProps.selection.multi) setSelectedRowIds(store, p.items, p.selectedItems || []);
			// Развернутые строки с порта.
			if (store.getState().tableProps.expansion.enabled) setExpandedRowIds(store, p.items, p.expandedItems || []);
		}
	}, [p]);

	/* useEffect(() => {
		// Следим за количеством созданных кастомных ячеек и/или разворачиваемых строк для единовременной установки статуса ready строкам.
		const unsubRowswReady =
			(p.columnsDefinition?.some((i) => i.type === 'template') || p.expansion) && // Выключим отслеживание, если нужно.
			store.subscribe((state) => setRowsReady(store, state));

		// Следим за изменением выбранной строки. Здесь используется точечная подписка за счет subscribeWithSelector.
		const unsubSelectedRow =
			store.getState().tableProps.selection.single.enabled && // Выключим отслеживание, если нужно.
			store.subscribe(
				(s) => s.selectedRowId,
				(selectedRowId, prevSelectedRowId) => sendSelectedRow(store, prevSelectedRowId, selectedRowId),
				{ fireImmediately: true } // Запуск в первый раз, чтобы выдать при первое назанчение с порта.
			);

		// Следим за изменением выбранных строк.
		const unsubSelectedRows =
			store.getState().tableProps.selection.multi && // Выключим отслеживание, если нужно.
			store.subscribe(
				(state) => state.selectedRowIds,
				(selectedRowIds) => sendSelectedRows(store, selectedRowIds),
				{ fireImmediately: true } // Запуск в первый раз, чтобы выдать при первое назанчение с порта.
			);

		// Следим за изменением развернутых строк.
		const unsubExpandedRows =
			store.getState().tableProps.expansion.enabled && // Выключим отслеживание, если нужно.
			store.subscribe(
				(state) => state.expandedRowIds,
				(expandedRowIds) => sendExpandedRows(store, expandedRowIds)
			);

		// Следим за изменением сортировки.
		const unsubSort =
			store.getState().tableProps.sort.enabled && // Выключим отслеживание, если нужно.
			store.subscribe(
				(state) => state.sort?.state,
				(sortState) => {
					if (sortState) frontSort(store, sortState, p.items);
				},
				{ fireImmediately: true }
			);

		return () => {
			unsubRowswReady && unsubRowswReady();
			unsubSelectedRow && unsubSelectedRow();
			unsubSelectedRows && unsubSelectedRows();
			unsubExpandedRows && unsubExpandedRows();
			unsubSort && unsubSort();
		};
	}, []); */

	// Внешние сигналы
	useImperativeHandle(
		ref,
		() => ({
			/* 					
					table2ResetSort() { setSortStatus(undefined) },
					table2ResetFilters() { resetFilters(); forceUpdate() }, */
			resetSelectedItem() {
				setSelectedRowId(store, p.items?.map((i) => i.id) || []);
			},
			resetSelectedItems() {
				setSelectedRowIds(store, p.items || [], []);
			},
			expandAll() {
				if (p.items) setExpandedRowIds(store, p.items, p.items);
			},
			unexpandAll() {
				setExpandedRowIds(store, p.items || [], []);
			},
		}),
		[p.items]
	);

	console.log('Table run', store.getState().tableId); // Считаем запуски пока разрабатываем
	return (
		<TableContext.Provider value={store}>
			<TableInstance />
		</TableContext.Provider>
	);
});

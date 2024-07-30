import { DataTable, type DataTableProps } from 'mantine-datatable';
import { memo, useState } from 'react';
import type { ColumnDefinition, TableState } from '../types';
import type { Item } from 'types';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { expendRows, getExpensionRowReactNode } from '../models/expansionRows';
import getRowBgColor from './funcs/getRowBgColor';
import { setSelectedRecord } from './funcs/singleSelection';

import selectionCss from './styles/selection.module.css';
import useSingleSelection from './hooks/useSingleSelection';

// Memo нужен для исключения повторных рендерингов, когда прилетают не измененные параметры.
export default memo(function (p: TableState) {
	//const { noodlNode, tableId, customProps, items, onRowClick, onRowClickFunc, tableStyles, rowStyles, selection, expansion } = props
	//const { noodlNode, tableId, ports, setTableState, columns, items, selection, rowStyles, expendedRowsIds } = tableState
	const { noodlNode, libState, fetching, columns, items, selection, ...restProps } = p;

	// Анимация таблицы
	//const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>();

	// Единичиныц выбор
	//const { selectedRecord, setSelectedRecord, resetSelectedRecord } = useSingleSelection(noodlNode, selection.single, items)

	// Multi selection
	//const { selectedRecords, setSelectedRecords } = useMultiSelection(noodlNode, selection.multi, items)

	// Реактивность на изменение развернутых строк
	//const expendedRowsIds = useStore(expendedRowsIdsAtom(tableState.tableId))

	// Input signals
	// useImperativeHandle(ref, () => ({
	//     resetSelecedItem() { resetSelectedRecord() },
	//     resetSelecedItems() { setSelectedRecords([]) },
	//     /* table2ResetSort() { setSortStatus(undefined) },
	//     table2ResetFilters() { resetFilters(); forceUpdate() }, */
	// }), [tableId, items, expansionRows])

	console.log('TableInstance render');

	return (
		<DataTable<Item>
			fetching={fetching}
			records={[]}
			columns={[]}
			//{...libState}
			//bodyRef={ports.animation ? bodyRef : undefined} // Анимация таблицы
			// Стили строк
			// Нужно отключать дефолтный цвет Mantine, когда накладываем цвет выбора. Найдено методом научного тыка.
			/* rowStyle={() => {
			let styles: any = {}
			if (selection.single.enabled) styles.pointer = 'cursor'
			if (selection.multi.enabled) styles['--mantine-primary-color-light'] = 'white'
			return styles
		}} */
			/* rowClassName={() => {
			if (selection.single.enabled) 
		}} */
			//(selection.multi.enabled ? selectionCss.multi : undefined)}
			//rowBackgroundColor={(record) => getRowBgColor(selection, rowStyles, record)}
			// Единичный выбор
			// Если задана функция, разработчик сам управляет, иначе включаем поведение для единичного выбора
			/* onRowClick={({ record }) => restProps.onRowClickFunc
			? restProps.onRowClickFunc(record, items)
			: selection.single.enabled
				? setSelectedRecord(record)
				: undefined} */
			/*onRowClick={({ record }) => ports.onRowClickFunc
			? ports.onRowClickFunc(record, records)
			: setSelectedRecord(noodlNode, selection.single, record)} */
			// Multi selection
			//selectedRecords={selection.multi.enabled ? selectedRecords : undefined}
			//onSelectedRecordsChange={setSelectedRecords}
			// Expansion
			/* rowExpansion={
			ports.expansion
				? {
					allowMultiple: ports.allowMultiple,
					// Разворачивание по клику на строку, если включено
					trigger: ports.onRowClick === 'expansion' ? 'click' : 'never',
					collapseProps: { transitionDuration: 150, ...ports.customProps?.collapseProps },
					expanded: {
						// Развернутые строки
						recordIds: expendedRowsIds,
						// Не разобрался с типизацией
						onRecordIdsChange: (recordIds: any) => expendRows(tableState.tableId, recordIds)
					},
					content: ({ record, collapse }) => {
						// Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную
						Noodl.Objects[record.id].collapse = collapse
						// Здесь, не запускаем функцию reactNode, т.к. content ждет ReactNode, т.е. функцию, а не результат ее выполения													
						return getExpensionRowReactNode(tableState.tableId, record.id)
					},
				}
				: undefined
		} */
			//{...tableState}
			//{...ports.customProps}
		/>
	);
	// Основной источник оптимизации. Точечно выбираем из tableState на что должна реагировать таблица
}); /* , (oldTableState, newTableState) => {
	let tableStateEquals = true
	if (oldTableState.fetching !== newTableState.fetching) tableStateEquals = false // Первый рендер
	console.log(oldTableState.selection.single.selectedItem?.id, newTableState.selection.single.selectedItem?.id)
	if (oldTableState.selection.single.selectedItem?.id !== newTableState.selection.single.selectedItem?.id) tableStateEquals = false
	if (!deepEqual(oldTableState.expendedRowsIds, newTableState.expendedRowsIds)) tableStateEquals = false
	return tableStateEquals
} */

/* Первичное состояние таблицы 
Устанавливаем fetching = true для демонстрации загрузки. Это первый рендеринг, который нужен для генерации кастомных ячеек, 
	разворачиваемых строк. Можно сделать вообще все сразу и добиться 1 рендеринга при сценарии, когда нет кастомных ячеек и 
	разворачиваемых строк, но это сильно усложянет код, а сценарий редкий.
*/

import { nanoid } from 'nanoid';
import type { Props, TableState } from '../../types';

export default function (p: Props) {
	return {
		// ========================================================
		// Эти параметры расширяют стандартные параметры библиотеки
		// ========================================================
		/* 		noodlNode: p.noodlNode,
		tableId: nanoid(8),
		ports: p, // Добавим первичное состояние портов, чтобы не тянуться до них
		columns: [],
		items: [],
		setTableState: () => {},
		// Стили строк
		rowStyles: {
			rowBackgroundColor: p.rowBackgroundColor || 'white',
			singleSelectionRowBgColor: p.singleSelectionRowBgColor || 'white',
			mutliSelectionRowBgColor: p.mutliSelectionRowBgColor || 'white'
		},
		// Первичное состояние выбора
		selection: {
			single: {
				enabled: p.singleSelection || false,
				unselectable: p.unselectable || false,
				// Исключаем ситуацию, когда разработчик подает selectedItem, которого нет в этой таблице
				selectedItem: p.selectedItem ? p.items?.find((i) => i.id === p.selectedItem?.id) : undefined
			},
			multi: {
				enabled: p.multiSelection || false,
				// Исключаем ситуацию, когда разработчик подает selectedItems, которых нет в этой таблице
				selectedItems: p.selectedItems ? p.items?.filter((i) => p.selectedItems?.map((i) => i.id).includes(i.id)) || [] : []
			}
		},
		// Разворачивание
		expendedRowsIds: p.expandedItems?.map((i) => i.id) || [] // Добавим первичные развернутые строки, если разработчик подал их */
		// ========================================================
		// Стандартные параметры библиотеки
		// ========================================================

		// Table styles
		shadow: p.shadow,
		withTableBorder: p.withTableBorder || false,
		borderRadius: p.borderRadius,
		withColumnBorders: p.withColumnBorders,
		emptyState: 'Записей не найдено'

		// Base
		/* columns: [],
		records: [],
		// States
		fetching: true,
		// Layout
		noHeader: p.noHeader,
		// Dimensions
		minHeight: p.minHeight || '84px',
		horizontalSpacing: p.horizontalSpacing,
		verticalSpacing: p.verticalSpacing,
		fz: p.fz,
		
		// Row styles
		withRowBorders: p.withRowBorders,
		striped: p.striped,
		stripedColor: p.striped ? p.stripedColor : 'white', // white отключает наследование
		highlightOnHover: p.highlightOnHover,
		highlightOnHoverColor: p.highlightOnHover ? p.highlightOnHoverColor : 'white', // white отключает наследование
		// Loader styles
		loaderSize: p.customProps?.loader?.size || 'lg',
		loaderType: p.customProps?.loader?.type || 'dots',
		loaderColor: p.loaderColor || 'blue',
		loaderBackgroundBlur: p.customProps?.loader?.bgBlur || 0.5,
		// Single selection
		// Если задана функция, разработчик сам управляет, иначе вкючаем поведение для еденичного выбора
		//onRowClick: ({ record }) => onRowClickFunc ? onRowClickFunc(record, items) : setSelectedRecord(record),
		// Multi selection
		selectionTrigger: p.selectionTrigger */
		/* tableStyles: {
      // Нужно отлкючать анимацию при сворачивании/разворачивании, иначе конфликтует с Collapse, в который обернуты rowExpansion
      animation: p.expansion ? false : p.animation === undefined ? false : p.animation
  },

*/
	};
}

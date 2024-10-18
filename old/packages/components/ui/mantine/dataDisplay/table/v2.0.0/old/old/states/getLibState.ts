/* Первичное состояние таблицы 
Устанавливаем fetching = true для демонстрации загрузки. Это первый рендеринг, который нужен для генерации кастомных ячеек, 
	разворачиваемых строк. Можно сделать вообще все сразу и добиться 1 рендеринга при сценарии, когда нет кастомных ячеек и 
	разворачиваемых строк, но это сильно усложянет код, а сценарий редкий.
*/

import type { Props } from '../../types'

export default function (p: Props) {
	return {
		// Layout
		noHeader: p.noHeader,
		// Dimensions
		minHeight: p.minHeight || '84px',
		horizontalSpacing: p.horizontalSpacing,
		verticalSpacing: p.verticalSpacing,
		fz: p.fz,
		// Table styles
		shadow: p.shadow,
		withTableBorder: p.withTableBorder || false,
		borderRadius: p.borderRadius,
		withColumnBorders: p.withColumnBorders,
		emptyState: 'Записей не найдено',
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
		//selectionTrigger: p.selectionTrigger
		/* tableStyles: {
      // Нужно отлкючать анимацию при сворачивании/разворачивании, иначе конфликтует с Collapse, в который обернуты rowExpansion
      animation: p.expansion ? false : p.animation === undefined ? false : p.animation
  },*/
	}
}

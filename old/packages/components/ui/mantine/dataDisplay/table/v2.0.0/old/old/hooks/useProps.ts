/*
Хука для управления пропсами. Больно много их в таблице.
Устанавливает все пропсы прямо, даже если это ничего не меняет.
Группирует пропсы для удобства.

Устанавливает дефолты. Можно было бы делать обычным способом - через настройку портов ноды, 
но слишком много сообщений об обязательнвх портах достают разработчика. Поэтому везде явные дефолты.
Нужно помнить на уровне портов установленный дефолт всегда есть для явно задаваемых портов (строки, числа).
Если разработчик передает такой порт пустым, значение все равно будет установлено дефолтным.
Поэтому, здесь такие дефолты повторяются, чтобы не путаться.
Дефотлные значения нужны еще и для решения пробоемы наследовагия стилей. Без них, таблица наседует стили родительской таблицы.

Порядок параметров отнсоительно синхронизирован с types.d.ts
libProps - стнадартные настройки библиотеки, которые не используются или используются повторно в Table.
*/

import { getCompProps } from '@packages/get-comp-props'
import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import type { Props, TableProps } from '../../types'
import useColumns from './useColumns'

export default function (props: Props): TableProps {
	const { customProps } = props
	const p = { ...getCompProps(props) } as Props

	// useMemo без зависимостей, чтобы id присваивался только при монтировании
	const tableId = useMemo(() => nanoid(8), [])

	// Опеределяем колонки здесь, т.к. они меняются только при изменении схемы разработчиком
	const columns = useColumns(p.noodlNode, tableId, p.items, p.columnsDefinition)

	const resultProps: TableProps = {
		// Base
		noodlNode: p.noodlNode,
		tableId,
		customProps,
		items: p.items || [],
		onRowClick: p.onRowClick || 'disabled',
		onRowClickFunc: p.onRowClick === 'function' ? p.onRowClickFunc : undefined,
		libProps: {
			// Base
			columns,
			records: p.items || [],
			// States
			fetching: p.fetching,
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
			loaderSize: props.customProps?.loader?.size || 'lg',
			loaderType: props.customProps?.loader?.type || 'dots',
			loaderColor: props.loaderColor || 'blue',
			loaderBackgroundBlur: props.customProps?.loader?.bgBlur || 0.5,
			// Multi selection
			selectionTrigger: p.selectionTrigger,
		},
		tableStyles: {
			// Нужно отлкючать анимацию при сворачивании/разворачивании, иначе конфликтует с Collapse, в который обернуты rowExpansion
			animation: p.expansion ? false : p.animation || true,
		},
		rowStyles: {
			rowBackgroundColor: p.rowBackgroundColor || 'white',
			singleSelectionRowBgColor: p.singleSelectionRowBgColor || 'white',
			mutliSelectionRowBgColor: p.mutliSelectionRowBgColor || 'white',
		},
		selection: {
			single: {
				enabled: p.singleSelection || false,
				unselectable: p.unselectable || false,
				selectedItem: p.selectedItem,
			},
			multi: {
				enabled: p.multiSelection || false,
				selectedItems: p.selectedItems || [],
			},
		},
		expansion: {
			enabled: p.expansion || false,
			template: p.expansionTemplate,
			allowMultiple: p.allowMultiple || false,
			collapseProps: { transitionDuration: 150, ...customProps?.collapseProps },
			expandedItems: p.expandedItems || [],
		},
	}

	return resultProps
}

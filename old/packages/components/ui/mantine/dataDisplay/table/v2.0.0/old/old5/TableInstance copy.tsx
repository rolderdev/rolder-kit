/* Сама таблица */

import { sendOutput, sendSignal } from '@packages/port-send'
import { DataTable } from 'mantine-datatable'
import { memo, useContext } from 'react'
import type { Item } from 'types'
import { useStore } from 'zustand'
import getRowBgColor from './funcs/getRowBgColor'
import AccessorCell from './render/AccessorCell'
import ExpanderCell from './render/ExpanderCell'
import ExpansionRow from './render/ExpansionRow'
import GetValueCell from './render/GetValueCell'
import TemplateCell from './render/TemplateCell'
import { setSelectedRowId } from './store/store'
import { TableContext } from './store/store'

import rowClasses from './styles/row.module.css'

// memo остановит любой рендер пришедший сверху, т.к. props просто нет.
export default memo(() => {
	const store = useContext(TableContext)
	if (!store) return

	// Можно так - const { libProps, columns, rowIds } = useStore(store), но тогда любые изменения хранилища будут запускать рендер.
	const noodlNode = useStore(store, (s) => s.noodlNode)
	const fetching = useStore(store, (s) => s.fetching)
	const libProps = useStore(store, (s) => s.libProps)
	const columns = useStore(store, (s) => s.columns)
	const rowIds = useStore(store, (s) => s.rowIds)
	const onRowClick = useStore(store, (s) => s.tableProps.onRowClick)
	const selection = useStore(store, (s) => s.tableProps.selection)
	const selectedRowIds = useStore(store, (s) => s.selectedRowIds)
	const expansion = useStore(store, (s) => s.tableProps.expansion)
	const expandedRowIds = useStore(store, (s) => s.expandedRowIds)
	const sortState = useStore(store, (s) => s.sort?.state)

	console.log('Table render', store.getState().tableId) // Считаем рендеры пока разрабатываем
	return (
		<DataTable<Item>
			// Base
			fetching={fetching}
			columns={columns.map((column) => {
				// Подставляем свою ячейку.
				return {
					...column.libColumn, // Берем из данных только настройки разработчика
					accessor: column.accessor, // Библиотеке нужен accessor.
					// Нужно подавать только id строки, чтобы управлять точечной реактивностью в ячейке.
					render: (row) => {
						// Если включено разворачивание и разарботчик запросил шеврон, нужно оберунть ячейки в шеврон.
						if (expansion.enabled && column.expander) {
							if (column.type === 'accessor' && column.accessor)
								return <ExpanderCell rowId={row.id} cell={<AccessorCell rowId={row.id} accessor={column.accessor} />} />
							if (column.type === 'getValue' && column.getValue)
								return <ExpanderCell rowId={row.id} cell={<GetValueCell rowId={row.id} columnIdx={column.idx} />} />
							if (column.type === 'template' && column.template)
								return <ExpanderCell rowId={row.id} cell={<TemplateCell rowId={row.id} columnIdx={column.idx} />} />
						} else {
							if (column.type === 'accessor' && column.accessor) return <AccessorCell rowId={row.id} accessor={column.accessor} />
							if (column.type === 'getValue' && column.getValue) return <GetValueCell rowId={row.id} columnIdx={column.idx} />
							if (column.type === 'template' && column.template) return <TemplateCell rowId={row.id} columnIdx={column.idx} />
						}
						return undefined
					},
				}
			})}
			// Тригерим только на смену id. Остальное решает ячейка.
			records={fetching ? [] : rowIds.map((i) => store.getState().rows.get(i)?.item as Item)}
			onRowClick={
				onRowClick === 'disabled'
					? undefined
					: ({ record }) => {
							if (onRowClick === 'signal') {
								// store.getState() позволяет передать item без рендера.
								sendOutput(noodlNode, 'clickedItem', store.getState().rows.get(record.id)?.item)
								sendSignal(noodlNode, 'rowClicked')
							}
							// Single selection
							if (onRowClick === 'singleSelection') setSelectedRowId(store, rowIds, record.id)
						}
			}
			// Row styles
			// Не смог разобраться почему rowBackgroundColor не достаточно для установки стилей мульти-выбора.
			rowClassName={rowClasses['mantine-datatable-row']} // Сброс встроенных стилей выделенной строки.
			rowStyle={() => ({ ['--mantine-primary-color-light']: 'transparent' })} // Сброс встроенных стилей включенного чекбокса.
			rowBackgroundColor={(record) => (selection.single.enabled || selection.multi ? getRowBgColor(record.id) : 'white')}
			// Multi selection
			// Это место заставило передавать весь item в таблицу, чтобы можно было использовать функции встроенную в библиотеку.
			selectedRecords={selection.multi ? selectedRowIds.map((i) => store.getState().rows.get(i)?.item as Item) : undefined}
			onSelectedRecordsChange={(selectedRows) => store.setState({ selectedRowIds: selectedRows.map((i) => i.id) })}
			// Expansion
			//@ts-ignore Не разобрался с типизацией
			rowExpansion={
				expansion.enabled
					? {
							allowMultiple: expansion.allowMultiple,
							// Разворачивание по клику на строку, если включено
							trigger: onRowClick === 'expansion' ? 'click' : 'never',
							collapseProps: expansion.collapseProps,
							expanded: {
								recordIds: expandedRowIds, // Развернутые строки.
								onRecordIdsChange: (expandedRowIds: string[]) => store.setState({ expandedRowIds }),
							},
							content: ({ record, collapse }) => {
								// Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную
								Noodl.Objects[record.id].collapse = collapse
								return <ExpansionRow rowId={record.id} />
							},
						}
					: undefined
			}
			// Sort
			sortStatus={sortState}
			onSortStatusChange={(state) => store.setState((s) => ({ sort: { ...s.sort, state } }))}
			{...libProps}
		/>
	)
})

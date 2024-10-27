/* Сама таблица */

import type { MantineStyleProp } from '@mantine/core'
import { sendOutput, sendSignal } from '@packages/port-send'
import { DataTable, type DataTableColumn } from 'mantine-datatable'
import { observer } from 'mobx-react-lite'
import { ExpansionRow } from './models/expansionRowModel'
import type { Record } from './models/recordModel'
import type { Store } from './models/storeModel'

export default observer((props: { store: Store }) => {
	const { noodlNode, tableId, fetching, columns, records, libProps, tableProps, expandedIds, setExpandedRows } = props.store

	console.log('Table render', tableId) // Считаем рендеры пока разрабатываем
	return (
		<DataTable<Record>
			// Base
			fetching={fetching} // Устанавливается в store.setState.
			// Деструктуризация нужна, чтобы observer включил реактивность, т.к. она для каждого объекта в массиве, а не на массив.
			columns={
				Array.from(columns.values()).map((column, columnIdx) => ({
					// Добавляем render здесь, используя одноименный view из модели.
					// Мы всегда используем render. Для библиотеки это кастомное решение, но MobX здесь позволяет свести кол-во рендеров к 1-му на ячейку.
					// columnDefinition - чтобы передать стандартные настройки колонки, width например.
					// accessor: `${columnIdx}` - обманываем библиотеку фиксируя accessor, т.к. он для нее id. Иначе множаться пачкованием.
					...column.columnDefinition,
					...column,
					accessor: `${columnIdx}`,
					render(record) {
						return record.render(column, tableProps.onRowClick)
					},
				})) as DataTableColumn<Record>[]
			}
			records={Array.from(records.values())}
			onRowClick={
				({ record }) => {
					if (tableProps.onRowClick === 'signal') {
						sendOutput(noodlNode, 'clickedItem', record.item)
						sendSignal(noodlNode, 'rowClicked')
					}
				}
				//Func ? ports.onRowClickFunc(record, records) : setSelectedRecord(noodlNode, selection.single, record)
			}
			// Row styles
			rowStyle={() => {
				const styles: MantineStyleProp = {}
				if (tableProps.onRowClick === 'signal') styles.cursor = 'pointer'
				//if (selection.multi.enabled) styles['--mantine-primary-color-light'] = 'white'
				return styles
			}}
			// Expansion
			rowExpansion={
				tableProps.expansion.enabled
					? {
							allowMultiple: tableProps.expansion.allowMultiple,
							// Разворачивание по клику на строку, если включено
							trigger: tableProps.onRowClick === 'expansion' ? 'click' : 'never',
							collapseProps: tableProps.expansion.collapseProps,
							expanded: {
								recordIds: expandedIds, // Развернутые строки. Деструктуризация для реактивности.
								onRecordIdsChange: setExpandedRows as any, // Не разобрался с типизацией
							},
							content: ({ record, collapse }) => {
								// Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную
								Noodl.Objects[record.id].collapse = collapse
								// Здесь, не запускаем функцию reactNode, т.к. content ждет ReactNode, т.е. функцию, а не результат ее выполения
								return <ExpansionRow reactNode={record.expansionReactNode} />
							},
						}
					: undefined
			}
			{...libProps}
		/>
	)
})

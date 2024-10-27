import { Skeleton } from '@mantine/core'
import get from 'just-safe-get'
import { Suspense, memo, useContext } from 'react'
import { useSnapshot } from 'valtio'
import { TableContext } from '../../table'
import type { Store } from '../../types'

export default memo((p: { recordId: string; columnIdx: number }) => {
	const { recordId, columnIdx } = p

	const store = useContext(TableContext) as Store
	const snap = useSnapshot(store) as Store

	const column = snap.columns[columnIdx]
	const record = snap.records.get(recordId)
	const getValueString = column.getValueStringFunc

	const Cell = () => {
		switch (column.type) {
			case 'accessor':
				// get дотягивается до конкретного ключа, что делает его точечно реактвиным.
				return column.accessor && record ? get(record.item, column.accessor) : undefined
			// Функция разработчика так же точечно реактвина.
			// Любое обращение к данным внтури getValue из схемы, сделает их реактивными.
			// Каждое изменение таких данных будет запускать getValue.
			case 'getValue': {
				let value = undefined
				// try catch, т.к. разработчик человек ))
				try {
					if (getValueString && record) value = eval(getValueString)(record.item)
				} catch (error: any) {
					R.libs.mantine?.MantineError(
						'Системная ошибка',
						`getValue eval error: ${error.message}. column: ${columnIdx}, itemId: ${record?.id}`
					)
				}
				return value
			}
			case 'template': {
				// record?.id - хак, если подать просто текст, почему то лишние рендеры.
				return <Suspense fallback={record?.id}>{record?.templateCells[columnIdx]}</Suspense>
			}
		}
	}

	console.log('Cell render', column.columnIdx, column.type, snap?.ready, record?.item.content?.name) // Считаем рендеры пока разрабатываем
	return (
		<Skeleton visible={!snap?.ready}>
			<Cell />
		</Skeleton>
	)
})

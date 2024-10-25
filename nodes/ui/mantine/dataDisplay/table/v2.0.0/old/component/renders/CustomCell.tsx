import { Box, Text } from '@mantine/core'
import type { Item } from '@shared/types-v0.1.0'
import { memo, useContext, useEffect, useState } from 'react'
import { TableContext } from '../TableProvider'
import useItem from '../funcs/useItem'
import useNode from '../funcs/useNode'
import type { Column } from '../models/column'

export default memo((p: { id: string; columnIdx: string }) => {
	const store = useContext(TableContext)

	const [value, setValue] = useState<string | number | undefined>()

	const column: Column = R.libs.just.get(store, ['columnsDefinition', p.columnIdx])
	const itemSnap = useItem(p.id, 'snap')

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let unsub: (() => void) | undefined

		const custom = column.custom
		if (itemSnap && custom) {
			const itemsSnap = store.records.map((i) => useItem(i.id, 'snap')).filter((i) => i !== undefined)
			const nodeSnap = useNode(store, p.id, 'snap')
			const nodeSub = useNode(store, p.id, 'store')
			const funcResult = custom(itemSnap, itemsSnap, nodeSnap)
			const getValue = funcResult.getValue
			const watchItems = funcResult.watchItems

			if (getValue && watchItems) {
				try {
					let watchItemsCount = 0
					unsub = R.libs.valtio.watch((get) => {
						if (nodeSub) get(nodeSub) // Ксотыль для сценария, когда watchItems пустой.
						watchItems.map((i: Item) => {
							get(i)
							watchItemsCount++
						})

						if (watchItemsCount === watchItems.length) {
							const itemSnap = useItem(p.id, 'snap')
							const itemsSnap = store.records.map((i) => useItem(i.id, 'snap')).filter((i) => !!i)
							const nodeSnap = useNode(store, p.id, 'snap')
							watchItemsCount = 0
							const v = itemSnap ? getValue(itemSnap, itemsSnap, nodeSnap) : undefined
							if (['string', 'number', 'undefined'].includes(typeof v)) {
								if (v !== value) setValue(v)
							} else {
								log.error(
									`custom cell error. Wrong getValue return type, expect "string", "number" or "undefined", got ${typeof v}`,
									column
								)
								R.libs.mantine?.MantineError?.(
									'Системная ошибка!',
									`custom cell error. Wrong getValue return type, expect "string", "number" or "undefined", got ${typeof v}. Column idx: ${
										column.idx
									}`
								)
							}
						}
					})
				} catch (e: any) {
					log.error('custom cell error', e)
					R.libs.mantine?.MantineError?.('Системная ошибка!', `custom cell error. ${e.message}`)
				}
			}
		}

		return () => unsub?.()
	}, [])

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion
	const level = store.hierarchy.level
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap)

	//console.log('CustomCell render', value); // Считаем рендеры пока разрабатываем
	return (
		<Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>
			<Text truncate={column.ellipsis ? 'end' : undefined} fz={store.libProps.fz}>
				{value}
			</Text>
		</Box>
	)
})

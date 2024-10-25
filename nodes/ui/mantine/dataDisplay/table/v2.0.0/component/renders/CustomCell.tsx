import { Box, Text } from '@mantine/core'
import type { Item } from '@shared/types-v0.1.0'
import { memo, useEffect, useState } from 'react'
import useItem from '../shared/useItem'
import useNode from '../shared/useNode'
import { useStore } from '../store'

export default memo((p: { tableId: string; id: string; columnIdx: string }) => {
	const s = useStore(p.tableId)

	const [value, setValue] = useState<string | number | undefined>()

	const column = s.columns[p.columnIdx]
	const itemSnap = useItem(p.id, 'snap')

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let unsub: (() => void) | undefined

		const custom = column.custom
		if (itemSnap && custom) {
			const itemsSnap = s.records.map((i) => useItem(i.id, 'snap')).filter((i) => i !== undefined)
			const nodeSnap = useNode(s, p.id, 'snap')
			const nodeSub = useNode(s, p.id, 'store')
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
							const itemsSnap = s.records.map((i) => useItem(i.id, 'snap')).filter((i) => !!i)
							const nodeSnap = useNode(s, p.id, 'snap')
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

	//console.log('CustomCell render', value); // Считаем рендеры пока разрабатываем
	return (
		<Box pl={s.tableProps.rowStyles.paddingLeftPostion === 'cell' && p.columnIdx === '0' ? s.rows[p.id].props?.pl : undefined}>
			<Text truncate={column.ellipsis ? 'end' : undefined} fz={s.libProps.fz}>
				{value}
			</Text>
		</Box>
	)
})

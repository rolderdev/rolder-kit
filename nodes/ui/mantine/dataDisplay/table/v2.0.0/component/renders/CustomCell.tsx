import { Box, Text } from '@mantine/core'
import type { Item } from '@shared/types-v0.1.0'
import { memo, useEffect, useState } from 'react'
import useItem from '../shared/useItem'
import useNode from '../shared/useNode'
import { useStore } from '../store'

export default memo((p: { tableId: string; id: string; columnId: string; isFirst: boolean }) => {
	const s = useStore(p.tableId)
	const sn = R.libs.valtio.useSnapshot(s)

	const [value, setValue] = useState<string | number | undefined>()

	const column = sn.columns[p.columnId]

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let unsub: (() => void) | undefined

		const custom = column.custom
		const itemSnap = useItem(p.id, 'snap')
		if (itemSnap && custom) {
			const itemsSnap = s.records.map((i) => useItem(i.id, 'snap')).filter((i) => i !== undefined)
			const nodeSnap = useNode(s, p.id, 'snap')
			const nodeStore = useNode(s, p.id, 'store')
			const funcResult = custom(itemSnap, itemsSnap, nodeSnap)
			const getValue = funcResult.getValue
			const watchItems = funcResult.watchItems

			if (getValue && watchItems) {
				try {
					let watchItemsCount = 0
					unsub = R.libs.valtio.watch((get) => {
						if (nodeStore) get(nodeStore) // Ксотыль для сценария, когда watchItems пустой.
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
									`custom cell error. Wrong getValue return type, expect "string", "number" or "undefined", got ${typeof v}. Column id: ${
										column.id
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
	}, [column])

	//console.log('CustomCell render', value) // Считаем рендеры пока разрабатываем
	return (
		<Box pl={s.tableProps.rowStyles.paddingLeftPostion === 'cell' && p.isFirst ? s.rows[p.id].props?.pl : undefined}>
			<Text truncate={column.ellipsis ? 'end' : undefined} fz={sn.libProps.fz}>
				{value}
			</Text>
		</Box>
	)
})

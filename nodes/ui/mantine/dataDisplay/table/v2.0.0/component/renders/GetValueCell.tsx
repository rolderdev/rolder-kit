import { Box, Text } from '@mantine/core'
import { memo, useState } from 'react'
import useItem from '../shared/useItem'
import useNode from '../shared/useNode'
import { useStore } from '../store'

export default memo((p: { tableId: string; id: string; columnId: string; isFirst: boolean }) => {
	const s = useStore(p.tableId)
	const sn = R.libs.valtio.useSnapshot(s)

	const [value, setValue] = useState<string | number | undefined>()

	const itemSub = useItem(p.id, 'sub')

	// Все items таблицы без подписки и snapshot.
	const itemsSnap = s.records.map((i) => useItem(i.id, 'snap')).filter((i) => i !== undefined)
	const nodeSub = useNode(s, p.id, 'sub')
	// Без подписки, заменится при смене схемы колонок.
	const column = sn.columns[p.columnId]
	const getValue = column.getValue

	try {
		// Точечная подписка на выполнение кода.
		const v = getValue && itemSub ? getValue(itemSub, itemsSnap, nodeSub) : undefined
		if (['string', 'number', 'undefined'].includes(typeof v)) {
			if (v !== value) setValue(v)
		} else {
			log.error(`getValue cell error. Wrong return type, expect "string", "number" or "undefined", got ${typeof v}`, column)
			R.libs.mantine?.MantineError?.(
				'Системная ошибка!',
				`getValue cell error. Wrong return type, expect "string", "number" or "undefined", got ${typeof v}. Column id: ${
					column.id
				}`
			)
		}
	} catch (e: any) {
		log.error('getValue error', e)
		R.libs.mantine?.MantineError?.('Системная ошибка!', `getValue error. ${e.message}`)
	}

	//console.log('GetValueCell render', value) // Считаем рендеры пока разрабатываем
	return (
		<Box pl={s.tableProps.rowStyles.paddingLeftPostion === 'cell' && p.isFirst ? s.rows[p.id].props?.pl : undefined}>
			<Text truncate={column.ellipsis ? 'end' : undefined} fz={sn.libProps.fz}>
				{value}
			</Text>
		</Box>
	)
})

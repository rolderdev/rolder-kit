import { Box, Text } from '@mantine/core'
import { memo } from 'react'

import useItem from '../shared/useItem'
import { useStore } from '../store'

export default memo((p: { tableId: string; id: string; columnId: string; isFirst: boolean }) => {
	const { get } = R.libs.just

	const s = useStore(p.tableId)
	const sn = R.libs.valtio.useSnapshot(s)

	const itemSub = useItem(p.id, 'sub')

	// Без подписки, заменится при смене схемы колонок.
	const accessor = get(s.columns, [p.columnId, 'accessor'])
	// Точечная подписка на значение.
	const value = itemSub ? get(itemSub, accessor) : undefined

	//console.log('AccessorCell render', value) // Считаем рендеры пока разрабатываем
	return (
		<Box pl={s.tableProps.rowStyles.paddingLeftPostion === 'cell' && p.isFirst ? s.rows[p.id].props?.pl : undefined}>
			<Text truncate={sn.columns[p.columnId].ellipsis ? 'end' : undefined} fz={sn.libProps.fz}>
				{value}
			</Text>
		</Box>
	)
})

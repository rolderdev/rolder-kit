import { Box } from '@mantine/core'
import { memo } from 'react'

import useItem from '../shared/useItem'
import { useStore } from '../store'

export default memo((p: { tableId: string; id: string; columnIdx: string }) => {
	const { get } = R.libs.just

	const s = useStore(p.tableId)
	const itemSub = useItem(p.id, 'sub')

	// Без подписки, заменится при смене схемы колонок.
	const accessor = get(s.columns, [p.columnIdx, 'accessor'])
	// Точечная подписка на значение.
	const value = itemSub ? get(itemSub, accessor) : undefined

	//console.log('AccessorCell render', value) // Считаем рендеры пока разрабатываем
	return (
		<Box pl={s.tableProps.rowStyles.paddingLeftPostion === 'cell' && p.columnIdx === '0' ? s.rows[p.id].props?.pl : undefined}>
			{value}
		</Box>
	)
})

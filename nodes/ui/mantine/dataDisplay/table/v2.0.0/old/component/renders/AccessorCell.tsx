import { Box } from '@mantine/core'
import { memo, useContext } from 'react'
import { TableContext } from '../TableProvider'
import useItem from '../funcs/useItem'

export default memo((p: { id: string; columnIdx: string }) => {
	const { get } = R.libs.just

	const store = useContext(TableContext)
	const itemSnap = useItem(p.id, 'snap')
	const itemSub = useItem(p.id, 'sub')

	// Без подписки, заменится при смене схемы колонок.
	const accessor = get(store, ['columnsDefinition', p.columnIdx, 'accessor'])
	// Точечная подписка на значение.
	const value = itemSub ? get(itemSub, accessor) : undefined

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion
	const level = store.hierarchy.level
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap)

	//console.log('AccessorCell render', value); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{value}</Box>
})

import { Box } from '@mantine/core'
import { memo } from 'react'
import { useStore } from '../store/store'

export default memo((p: { itemId: string; itemFid?: string; columnIdx: number }) => {
	const s = useStore()
	if (!s) return

	// Подпишемся на изменение самой функции.
	const getValue = s.cold.columnsDefinition.use((columns) => columns[p.columnIdx].getValue)

	// Здесь важно делать вычисления внутри use, тогда рендеринг будет точечный.
	const value = s.hot.items.use((i) => {
		const item = i.find((i) => i.id === p.itemId)
		const hierarchyNode = s.get((s) => s.scopeStore?.get()?.hierarchy?.find((i) => i.data.fid === p.itemFid))
		if (item) return getValue?.(item, s.hot.items.get(), hierarchyNode)
		return
	})

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = s.hot.tableProps.rowStyles.paddingLeftPostion.use()
	const level = s.level.use()
	const pl = s.hot.tableProps.use((state) =>
		state.paddingLeftFunc?.(
			level,
			s.hot.items.get((i) => i.find((i) => i.id === p.itemId))
		)
	)

	//console.log('GetValueCell render', s.tableId.get(), value, p.itemId, p.itemFid); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && !p.columnIdx ? pl : undefined}>{value}</Box>
})

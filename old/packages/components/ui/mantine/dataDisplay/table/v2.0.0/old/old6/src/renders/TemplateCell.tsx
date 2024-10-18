import { Box } from '@mantine/core'
import { memo } from 'react'
import { useStore } from '../store'

export default memo((p: { itemId: string; columnIdx: number }) => {
	const store = useStore()
	if (!store) return

	// Применим реактивность только к изменению кастомной ячейки.
	const templateCell = store.templateCells.use((s) => s[p.columnIdx]?.[p.itemId])

	const paddingLeft = store.tableProps.expansion.paddingLeft.use()
	const level = store.level.use()

	//console.log('TemplateCell render', p.itemId); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeft.position === 'cell' ? paddingLeft.value * level : undefined}>{templateCell}</Box>
})

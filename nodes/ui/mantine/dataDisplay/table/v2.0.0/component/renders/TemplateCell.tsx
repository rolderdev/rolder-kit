import { Box } from '@mantine/core'
import { memo, useEffect, useState } from 'react'
import getRoodlReactNode from '../shared/getRoodlReactNode'
import { useStore } from '../store'

export default memo((p: { tableId: string; id: string; columnIdx: string }) => {
	const s = useStore(p.tableId)

	// Кастомный Suspense.
	const [templateCell, setTemplateCell] = useState<React.ReactNode | undefined>(undefined)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const nodePath = s.hierarchy?.tableNode?.childNodes().find((i) => i.itemId === p.id)?.path
		getRoodlReactNode(s, p.id, R.libs.just.get(s.columns, [p.columnIdx, 'template']), {
			itemId: p.id,
			level: s.hierarchy?.level || 0,
			nodePath,
		}).then(setTemplateCell)
	}, [])

	//console.log('TemplateCell render', p.id); // Считаем рендеры пока разрабатываем
	return (
		<Box pl={s.tableProps.rowStyles.paddingLeftPostion === 'cell' && p.columnIdx === '0' ? s.rows[p.id].props?.pl : undefined}>
			{templateCell}
		</Box>
	)
})

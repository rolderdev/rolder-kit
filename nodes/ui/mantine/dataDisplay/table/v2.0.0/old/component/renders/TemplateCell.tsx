import { Box, Skeleton } from '@mantine/core'
import { memo, useContext, useEffect, useState } from 'react'
import { TableContext } from '../TableProvider'
import getRoodlReactNode from '../funcs/getRoodlReactNode'
import useItem from '../funcs/useItem'

export default memo((p: { id: string; columnIdx: string }) => {
	const store = useContext(TableContext)

	// Кастомный Suspense.
	const [templateCell, setTemplateCell] = useState<React.ReactNode | undefined>(undefined)
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const nodePath = store.hierarchy.tableNode?.childNodes().find((i) => i.itemId === p.id)?.path
		getRoodlReactNode(store, p.id, R.libs.just.get(store.columnsDefinition, [p.columnIdx, 'template']), {
			itemId: p.id,
			level: store.hierarchy.level,
			nodePath,
		}).then((reactNode) => setTemplateCell(reactNode))
	}, [])

	// snapshot без подписки для передачи в функции.
	const itemSnap = useItem(p.id, 'snap')

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion
	const level = store.hierarchy.level
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap)

	//console.log('TemplateCell render', p.id); // Считаем рендеры пока разрабатываем
	// Проба пера - будет ли симпатичнее с Skeleton? Размер автоматически коректен.
	return (
		<Skeleton visible={!templateCell}>
			<Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{templateCell}</Box>
		</Skeleton>
	)
})

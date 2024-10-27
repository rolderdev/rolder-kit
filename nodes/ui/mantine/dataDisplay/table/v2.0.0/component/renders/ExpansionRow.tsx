import { Box, Center, Loader } from '@mantine/core'
import { memo, useEffect, useState } from 'react'
import getRoodlReactNode from '../shared/getRoodlReactNode'
import useNode from '../shared/useNode'
import { useStore } from '../store'

export default memo((p: { tableId: string; id: string }) => {
	const s = useStore(p.tableId)

	const [expansionRow, setExpansionRow] = useState<React.ReactNode | undefined>(undefined)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const nodeSnap = useNode(s, p.id, 'snap')
		if (nodeSnap)
			getRoodlReactNode(s, p.id, s.tableProps.expansion.template, {
				itemId: p.id,
				level: s.hierarchy?.level || 0,
				nodePath: nodeSnap.path,
			}).then((reactNode) => setTimeout(() => setExpansionRow(reactNode), 200))
	}, [])

	const LoaderAnimation = () => (
		<Center>
			<Loader size={s.libProps.loaderSize} color={s.libProps.loaderColor} type={s.libProps.loaderType} />
		</Center>
	)

	//console.log('ExpansionRow render', expansionRow); // Считаем рендеры пока разрабатываем
	// Уберем изменение цвета при наведении.
	return <Box style={{ background: 'white' }}>{expansionRow || <LoaderAnimation />}</Box>
})

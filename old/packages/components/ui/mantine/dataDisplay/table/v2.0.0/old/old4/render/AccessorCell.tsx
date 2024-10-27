import { Skeleton } from '@mantine/core'
import get from 'just-safe-get'
import { memo, useContext } from 'react'
import { useSnapshot } from 'valtio'
import { TableContext } from '../../table'
import type { Store } from '../../types'

export default memo((p: { recordId: string; accessor: string }) => {
	const store = useContext(TableContext) as Store
	const item = useSnapshot(store.records.get(p.recordId)?.item || {})
	const snap = useSnapshot(store)

	console.log('AccessorCell render', get(item, p.accessor), snap?.ready) // Считаем рендеры пока разрабатываем
	return <Skeleton visible={!snap?.ready}>{get(item, p.accessor)}</Skeleton>
})

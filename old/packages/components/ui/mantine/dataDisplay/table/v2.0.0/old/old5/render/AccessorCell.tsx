import { Skeleton } from '@mantine/core'
import get from 'just-safe-get'
import { memo, useContext } from 'react'
import { useStore } from 'zustand'
import { TableContext } from '../store/store'

export default memo((p: { rowId: string; accessor: string }) => {
	const store = useContext(TableContext)
	if (!store) return

	// Вытягиваем значение ячейки. get делает реактивночть точечной, т.к. запрашивает конкртеный ключ.
	const value = useStore(store, (s) => get(s.rows.get(p.rowId)?.item || {}, p.accessor))

	// Состояние готовности кастномных ячеек строки и/или разворачиваемой строки.
	const ready = useStore(store, (s) => s.rows.get(p.rowId)?.ready)

	console.log('AccessorCell render', value) // Считаем рендеры пока разрабатываем
	return <Skeleton visible={!ready}>{value}</Skeleton>
})

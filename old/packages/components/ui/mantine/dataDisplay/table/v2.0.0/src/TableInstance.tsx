/* Управляющая компонента. Управляет состояние дочерней Table. */

import { useShallowEffect } from '@mantine/hooks'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import type { Props } from '../types'
import Table from './Table'
import { setSelectedItemsFromScope } from './models/multiSelectionModel'
import { frontSortItems, sendSortState } from './models/sortModel'
import { useStore } from './store/store'

export default forwardRef((p: Props, ref) => {
	const s = useStore()
	if (!s) return

	// Возвращаем store в TableProvider для внешних сигналов.
	useImperativeHandle(ref, () => ({ store: s }), [s])

	// Не будем показывать таблицу пока ее параметры не готовы.
	const inited = s.inited.use()

	//// Реактивность на изменения TableScope.
	const scopeStore = s.scopeStore.get()
	// Мульти-выбор.
	const selectedItems = scopeStore?.selectedItems.use({ items: p.items || [] })
	useShallowEffect(() => {
		if (selectedItems) setSelectedItemsFromScope(s, selectedItems)
	}, selectedItems)
	// Сортировка.
	const sortState = scopeStore?.sortState.use()
	useShallowEffect(() => {
		const sort = s.cold.tableProps.sort.get()
		if (sort && sortState && s.isChild.get() && sort.enabled) {
			const newState = { ...(s.sortState.get() as any), direction: sortState.direction }
			s.sortState.set(newState)
			if (sort.type === 'frontend') s.hot.items.set(frontSortItems(s))
			sendSortState(s)
		}
	}, [sortState])

	//// Обновление состояния с портов.
	useEffect(() => {
		s.updateColdState(p)
	}, [p])

	//console.log('TableInstance run'); // Считаем запуски пока разрабатываем
	return inited && <Table />
})

import { useShallowEffect } from '@mantine/hooks'
import type { NoodlNode } from '@packages/node'
import { sendOutput, sendSignal } from '@packages/port-send'
import deepEqual from 'fast-deep-equal'
import { useState } from 'react'
import type { Item } from 'types'
import type { TableProps } from '../../types'

export default function (noodlNode: NoodlNode, multiselection: TableProps['selection']['multi'], items: Item[]) {
	const [selectedRecords, setSelectedRecords] = useState<Item[]>([])

	// Shallow вместо обычного useEffect, чтобы тригерилось только на измение массива - https://mantine.dev/hooks/use-shallow-effect/
	useShallowEffect(() => {
		// Нужна проверка на то, не собрался ли воткнуть разработчик сюда items, не принадлежащие к этой таблице
		// Берем из поданых items только те, что есть в таблице
		const selectedItems = multiselection.selectedItems.filter((i) => items.map((i) => i.id).includes(i.id))
		// Устанавливаем новый стейт, только при отличии, чтобы не рендерить таблицу почем зря
		if (!deepEqual(selectedItems, selectedRecords)) setSelectedRecords(selectedItems)
	}, [multiselection.selectedItems])

	// Подаем на выход выбранные items. Это происходит и c пустым массиво в первый рендеринг.
	useShallowEffect(() => {
		sendOutput(noodlNode, 'selectedItems', selectedRecords)
		// Сиганл уйдет с задержкой в 1 мс
		sendSignal(noodlNode, 'selectedItemsChanged')
	}, [selectedRecords])

	return { selectedRecords, setSelectedRecords }
}

/* Хук создающий колонки по схеме
Концеция. Хука должна запускаться только при смене схемы разработчиком. 
Для этого useEffect имеет только одну зависимость - columnsDefinition.
Это приводит к хитростям с expansionRow, т.к. позиция шеврона зависит от состояния развернутости строк.

Помимо стандартных настроек библиотеки добавляет наши варианты ячеек. Смотри getColumn.
*/

import { useShallowEffect } from '@mantine/hooks'
import type { NoodlNode } from '@packages/node'
import { useState } from 'react'
import type { Item } from 'types'
import type { ColumnDefinition } from '../../types'
import getColumn from '../funcs/getColumn'

export default function (noodlNode: NoodlNode, tableId: string, items?: Item[], columnsDefinition?: ColumnDefinition[]) {
	const [columns, setColumns] = useState<ColumnDefinition[]>([])

	// Shallow, т.к. схема колонок - массив объектов, который не умеет сравнивать useEffect.
	useShallowEffect(() => {
		if (columnsDefinition?.length && items?.length) {
			// Функция асинхронная. useEffect не умеет асинхронно, поэтому через then
			// Создаем все варианты колонок разом
			Promise.all(columnsDefinition.map(async (columnDefinition) => getColumn(noodlNode, tableId, columnDefinition, items))).then(
				setColumns
			)
		}
	}, [columnsDefinition])

	return columns
}

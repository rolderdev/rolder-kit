/* Функция создает React-ноды для всех заданных items и колонок */

import type { NoodlNode } from '@packages/node'
import { nanoid } from 'nanoid'
import type { Column } from '../models/columnModel'

export default async function (noodlNode: NoodlNode, columns: Column[], itemIds: string[]) {
	const customCells = new Map<string, { columnIdx: number; reactNode: React.ReactNode }[]>()

	await Promise.all(
		itemIds.map(async (itemId) => {
			await Promise.all(
				columns.map(async (column, columnIdx) => {
					// не фильтр выше, а условие, чтобы columnIdx был всегда по порядку
					if (column.type === 'template' && column.template) {
						// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
						const group = noodlNode.nodeScope.createPrimitiveNode('Group')
						// Используем шаблон и присваиваем новый id
						const newNode = await noodlNode.nodeScope.createNode(column.template, nanoid(), {
							// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
							_forEachModel: Noodl.Objects[itemId],
							// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
							_forEachNode: noodlNode,
						})
						// Добавляем в группу Noodl созданную ноду
						group.addChild(newNode)
						// Здесь мы именно запускаем render, который возвращает React-ноду
						const itemColumnsCells = customCells.get(itemId) || []
						itemColumnsCells.push({ columnIdx, reactNode: group.render() })
						customCells.set(itemId, itemColumnsCells)
					}
				})
			)
		})
	)

	return customCells
}

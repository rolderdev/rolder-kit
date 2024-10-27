import type { NoodlNode } from '@packages/node'
import { nanoid } from 'nanoid'

export default async function (noodlNode: NoodlNode, itemIds: string[], expansionTemplate: string) {
	const expensionRows = new Map<string, React.ReactNode>()

	await Promise.all(
		itemIds.map(async (itemId) => {
			// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
			const group = noodlNode.nodeScope.createPrimitiveNode('Group')
			// Используем шаблон и присваиваем новый id
			const newNode = await noodlNode.nodeScope.createNode(expansionTemplate, nanoid(), {
				// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
				_forEachModel: Noodl.Objects[itemId], // Как это работает, если мы создаем Noodl-объекты позже в установке колонок?
				// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
				_forEachNode: noodlNode,
			})
			// Добавляем в группу Noodl созданную ноду
			group.addChild(newNode)
			// Здесь мы именно запускаем render, который возвращает React-ноду
			expensionRows.set(itemId, group.render())
		})
	)

	return expensionRows
}

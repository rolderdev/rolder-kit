/* Функция создает React-ноду для кастомной ячейки. */

import { nanoid } from 'nanoid'
import type { Store } from '../store'

export default async function (store: Store, itemId: string, columnIdx: number) {
	const noodlNode = store.noodlNode.get()
	// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
	const group = noodlNode.nodeScope.createPrimitiveNode('Group')
	// Используем шаблон и присваиваем новый id
	const newNode = await noodlNode.nodeScope.createNode(store.columns[columnIdx].template?.get(), nanoid(), {
		// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
		_forEachModel: Noodl.Objects[itemId],
		// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
		_forEachNode: noodlNode,
	})
	// Добавляем в группу Noodl созданную ноду
	group.addChild(newNode)
	// Чтобы успела отобразиться анимацяи загрузки. 200 - поскольку равзоравчивание имеет длительность анимации в 150, + небольшой запас.
	//await new Promise((r) => setTimeout(r, 200));
	// Здесь мы именно запускаем render, который возвращает React-ноду
	return group.render() as React.ReactNode
}

/* Функция создает React-ноды для всех заданных items и колонок */

import { nanoid } from 'nanoid'
import type { Column } from '../models/columnModel'
import type { Row } from '../models/rowMoldel'
import type { Store } from '../store/store'

export default async function (store: Store, column: Column, row: Row) {
	const noodlNode = store.getState().noodlNode
	// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
	const group = noodlNode.nodeScope.createPrimitiveNode('Group')
	// Используем шаблон и присваиваем новый id
	const newNode = await noodlNode.nodeScope.createNode(column.template, nanoid(), {
		// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
		_forEachModel: Noodl.Objects[row.id],
		// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
		_forEachNode: noodlNode,
	})
	// Добавляем в группу Noodl созданную ноду
	group.addChild(newNode)
	// Здесь мы именно запускаем render, который возвращает React-ноду
	const reactNode = group.render() as React.ReactNode
	// Чтобы успела отобразиться анимацяи загрузки. 200 - поскольку равзоравчивание имеет длительность анимации в 150, + небольшой запас.
	//await new Promise((r) => setTimeout(r, 200));
	row.templateCells.set(column.idx, reactNode)
	const rows = store.getState().rows
	rows.set(row.id, row)
	store.setState({ rows }) // Не страшно, что мы устанавливаем все строки из-за одной. Zustand сделает merge.
}

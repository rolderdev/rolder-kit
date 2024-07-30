/* Функция создает React-ноды для всех заданных items и колонок */

import { nanoid } from 'nanoid';
import type { Store } from '../store';

export default async function (store: Store, itemId: string) {
	const noodlNode = store.noodlNode.get();
	// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
	const group = noodlNode.nodeScope.createPrimitiveNode('Group');
	// Используем шаблон и присваиваем новый id
	const newNode = await noodlNode.nodeScope.createNode(store.tableProps.expansion.template?.get(), nanoid(8), {
		// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
		_forEachModel: Noodl.Objects[itemId],
		// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
		_forEachNode: noodlNode,
		// Запишем id, чтобы потом выятнуть его из props.noodlNode.nodeScope.componentOwner.itemId
		itemId,
	});
	// Добавляем в группу Noodl созданную ноду
	group.addChild(newNode);
	// Здесь мы именно запускаем render, который возвращает React-ноду
	return group.render() as React.ReactNode;
}

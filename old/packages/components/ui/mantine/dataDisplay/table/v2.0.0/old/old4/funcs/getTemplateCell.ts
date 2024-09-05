/* Функция создает React-ноды для всех заданных items и колонок */

import { nanoid } from 'nanoid';
import type { NoodlNode } from '@packages/node';

export default async function (noodlNode: NoodlNode, template: string, recordId: string) {
	// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
	const group = noodlNode.nodeScope.createPrimitiveNode('Group');
	// Используем шаблон и присваиваем новый id
	const newNode = await noodlNode.nodeScope.createNode(template, nanoid(), {
		// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
		_forEachModel: Noodl.Objects[recordId],
		// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
		_forEachNode: noodlNode
	});
	// Добавляем в группу Noodl созданную ноду
	group.addChild(newNode);
	// Здесь мы именно запускаем render, который возвращает React-ноду
	await new Promise((r) => setTimeout(r, 1000));
	return group.render() as React.ReactNode;
}

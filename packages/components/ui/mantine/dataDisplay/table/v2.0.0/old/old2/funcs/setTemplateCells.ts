/* Функция создает React-ноды для всех заданных items и колонок */

import { nanoid } from 'nanoid';
import type { NoodlNode } from '@packages/node';
import type { Column } from '../models/columnModel';

export default async function (noodlNode: NoodlNode, columns: Column[], recordId: string) {
	let recordTemplateCells = new Map<number, React.ReactNode>();

	await Promise.all(
		columns.map(async (column, columnIdx) => {
			// не фильтр выше, а условие, чтобы columnIdx был всегда по порядку
			if (column.type === 'template' && column.template) {
				// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
				const group = noodlNode.nodeScope.createPrimitiveNode('Group');
				// Используем шаблон и присваиваем новый id
				const newNode = await noodlNode.nodeScope.createNode(column.template, nanoid(), {
					// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
					_forEachModel: Noodl.Objects[recordId],
					// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
					_forEachNode: noodlNode
				});
				// Добавляем в группу Noodl созданную ноду
				group.addChild(newNode);
				// Здесь мы именно запускаем render, который возвращает React-ноду
				recordTemplateCells.set(columnIdx, group.render());
			}
		})
	);

	return recordTemplateCells;
}

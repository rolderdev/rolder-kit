// Создает React-ноду для кастомной ячейки или разворачиваемой строки.

import type { Store } from '../store';
import type { FilterState } from '@nodes/table-filter-v0.1.0';

export type MetaData = {
	itemId: string;
	nodePath?: string;
	level: number;
	columnIdx?: string;
	filterState?: FilterState;
	close?: () => void;
};

export default async (s: Store, id: string, template: string, metaData: MetaData) => {
	const noodlNode = s.noodlNode;
	// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
	const group = noodlNode.nodeScope.createPrimitiveNode('Group');
	// Используем шаблон и присваиваем новый id
	const newNode = await noodlNode.nodeScope.createNode(template, R.libs.nanoid(), {
		// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
		_forEachModel: { id },
		// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
		_forEachNode: noodlNode,
		metaData,
	});
	// Добавляем в группу Noodl созданную ноду
	group.addChild(newNode);
	// Здесь мы именно запускаем render, который возвращает React-ноду
	return group.render() as React.ReactNode;
};

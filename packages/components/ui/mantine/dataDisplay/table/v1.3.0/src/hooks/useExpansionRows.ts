/*
Хука для создания и удаления нод Noodl по шаблону при разворачивании/сворачивании.
Решает три проблемы:
  1. Ноды создаются асинхронно, а стандратная реализация разворачивания/сворачивания в библиотеке синхронная
  2. Нужно создавать ноду до разворачивания, иначе глюки.
  3. Нужно удалять ноду после завершения анимации. К серьезным проблемам не приводит, просто не красиво.  
*/

import type { NoodlNode } from '@packages/node';
import { useEffect, useState } from 'react';
import type { Item } from 'types';
import type { TableProps } from '../../types';
import { nanoid } from 'nanoid';
import { sendOutput, sendSignal } from '@packages/port-send';

// Статус нужен, чтобы удалять ноды по завершению анимации.
type ExpansionRow = {
	deleted: boolean;
	item: Item;
	reactNode: React.ReactNode;
};

export default function (noodlNode: NoodlNode, items: Item[], expansion: TableProps['expansion']) {
	const [expansionRows, setExpansionRows] = useState<ExpansionRow[]>([]);

	const updateExpansionRows = async (changedRecordIds: string[]) => {
		// Находим разницу
		const toAddItems = items.filter(
			(i) => !expansionRows.map((i) => i.item.id).includes(i.id) && changedRecordIds.includes(i.id)
		);
		const toDeleteItemIds = expansionRows.map((i) => i.item.id).filter((i) => !changedRecordIds.includes(i));

		// Создаем новые ноды
		let newExpansionRows: ExpansionRow[] = [];
		if (toAddItems.length) newExpansionRows = await createExpansionRows(noodlNode, expansion, toAddItems);

		// Фиксируем ноды на удаление
		let toDeleteExpansionRows: ExpansionRow[] = [];
		if (toDeleteItemIds.length)
			toDeleteExpansionRows = expansionRows
				.filter((i) => toDeleteItemIds.includes(i.item.id))
				.map((i) => ({ ...i, deleted: true }));

		// Находим не измененные ноды
		const notChangedExpansionRows = expansionRows.filter(
			(i) => !newExpansionRows.map((i) => i.item.id).includes(i.item.id) && !toDeleteItemIds.includes(i.item.id)
		);

		// Тригерим таблицу
		setExpansionRows([...notChangedExpansionRows, ...newExpansionRows, ...toDeleteExpansionRows]);

		// Удаляем ноды после завершения анимации
		await new Promise((r) => setTimeout(r, expansion.collapseProps.transitionDuration));
		setExpansionRows([...notChangedExpansionRows, ...newExpansionRows]);
	};

	// Устанавливаем развернутые строки, прилетевшие извне
	useEffect(() => {
		// Устанавливаем только не пустые прилетевшие значения. Для сворачивания всего есть unexpandAll.
		if (expansion.expandedItems.length) updateExpansionRows(expansion.expandedItems.map((i) => i.id));
	}, [expansion.expandedItems]);

	// Отправляем развернутые items и сигнал при изменениях
	useEffect(() => {
		sendOutput(
			noodlNode,
			'expandedItems',
			expansionRows.map((i) => i.item)
		);
		sendSignal(noodlNode, 'expansionChanged');
	}, [expansionRows.map((i) => i.item.id)]);

	return { expansionRows, updateExpansionRows };
}

async function createExpansionRows(noodlNode: NoodlNode, expansion: TableProps['expansion'], toAddItems: Item[]) {
	return Promise.all(
		toAddItems.map(async (item) => {
			// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
			const group = noodlNode.nodeScope.createPrimitiveNode('Group');
			// Стили - занимает всю ширину достуного места
			group.setStyle({ flex: '1 0 100%' });
			// Используем шаблон и присваиваем новый id
			const newNode = await noodlNode.nodeScope.createNode(expansion.template, nanoid(), {
				// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
				_forEachModel: Noodl.Object.create(item),
				// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
				_forEachNode: noodlNode
			});
			// Добавляем в группу Noodl созданную ноду
			group.addChild(newNode);
			// Здесь мы именно запускаем render, который возвращает React-ноду
			return { deleted: false, item, reactNode: group.render() };
		})
	);
}

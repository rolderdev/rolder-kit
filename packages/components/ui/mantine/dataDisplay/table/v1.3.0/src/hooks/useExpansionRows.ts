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
import { sendOutput, sendSignal } from '../../../../../../../../internal/utils/portSend/v0.3.0/portSend';

// Тип данных создан так, чтобы было удобно настравивать реактивность.
// Все в одной структуре чтобы не делать двойной рендеринг.
// При разворачивании, записываем сразу item и React ноду.
// При сворачивании сначала меняем статус, чтобы тригенрунть сворачивание, потом удаляем.
// Статус нужен для фильтрации, чтобы таблица считала item удаленным пока сворачивается
type ExpansionRow = {
	deleted: boolean;
	item: Item;
	reactNode: () => void;
};

export default function (noodlNode: NoodlNode, items: Item[], expansion: TableProps['expansion']) {
	const [expansionRows, setEpansionRows] = useState<ExpansionRow[]>([]);

	const updateExpansionRows = (changedRecordIds: string[]) => {
		// Создаем новые ноды при разворачивании
		if (expansionRows.length < changedRecordIds.length) {
			// Находим новые id items, на основе которых создадим новые ноды
			const newItemIds = changedRecordIds.filter((i) => !expansionRows.map((i) => i.item.id).includes(i));
			// Все одновременно
			Promise.all(
				newItemIds.map((newItemId) => {
					const item = items.find((i) => i.id === newItemId);
					if (item) {
						// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
						const group = noodlNode.nodeScope.createPrimitiveNode('Group');
						// Стили - занимает всю ширину достуного места
						group.setStyle({ flex: '1 0 100%' });
						// Само создание ноды, асинхронно. useEffect не умеет работать с async, поэтому здесь все через then.
						return (
							noodlNode.nodeScope
								// Используем шаблон и присваиваем новый id
								.createNode(expansion.template, nanoid(), {
									// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
									_forEachModel: Noodl.Object.create(item),
									// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
									_forEachNode: noodlNode
								})
								.then((node: any) => {
									// Добавляем в группу Noodl созданную ноду
									group.addChild(node);
									return { itemId: item.id, item, reactNode: group.render() };
								})
						);
					}
				})
			).then((newExpansionRows) => setEpansionRows([...expansionRows, ...newExpansionRows]));
		}

		// Удаляем сворачиваемые ноды
		if (expansionRows.length > changedRecordIds.length) {
			// Находим удаялемые id items нод, которые удаляем
			const toDeleteItemIds = expansionRows.map((i) => i.item.id).filter((i) => !changedRecordIds.includes(i));
			// Сначала устанавливаем статус для каждого удаленного expansionRow. Таблица запустит анимацию сворачивания.
			setEpansionRows(expansionRows.map((i) => ({ ...i, deleted: toDeleteItemIds.includes(i.item.id) ? true : false })));
			// После завершения анимации, удаляем ноду, чтобы память не утекала и не понятно, что будет происходить в неудаленной ноде.
			setTimeout(
				() => setEpansionRows(expansionRows.filter((i) => !toDeleteItemIds.includes(i.item.id))),
				expansion.collapseProps.transitionDuration
			);
		}
	};

	// Устанавливаем развернутые строки, прилетевшие извне
	useEffect(() => updateExpansionRows(expansion.expandedItems.map((i) => i.id)), [expansion.expandedItems]);

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

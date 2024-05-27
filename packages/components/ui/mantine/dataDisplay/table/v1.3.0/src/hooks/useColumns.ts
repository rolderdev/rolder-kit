/* Хук создающий колонки по схеме
Помимо стандартных настроек библиотеки добавляет:
	1. Кастомные ячейки, которые работают по принципу Repeater в Noodl.
	2. getValue - заменяет функцию render из библиотеки, т.к. она нужна для кастомных ячеек.

Данное решение не использует оптимизации - хук перезапускается при каждом изменении columnsDef или items.
Если в expansionRows нод создается столько, сколько есть развернутых строк, то здесь количество строк * количество кастомных ячеек

Cмотри так же useExpansionRows.ts.
*/

import type { NoodlNode } from '@packages/node';
import type { ColumnDefinition } from '../../types';
import { useEffect, useState } from 'react';
import type { Item } from 'types';
import { nanoid } from 'nanoid';

export default function (noodlNode: NoodlNode, items?: Item[], columnsDefinition?: ColumnDefinition[]) {
	const [columns, setColumns] = useState<ColumnDefinition[]>([]);

	useEffect(() => {
		if (columnsDefinition?.length && items?.length) {
			// Функция асинхронная. useEffect не умеет асинхронно. Можно делать через then, но удобнне просто передавать функции, устанавливающие стейты.
			updateColumns(noodlNode, items, columnsDefinition, setColumns);
		}
	}, [columnsDefinition]);

	return columns;
}

async function updateColumns(
	noodlNode: NoodlNode,
	items: Item[],
	columnsDefinition: ColumnDefinition[],
	setColumns: React.Dispatch<React.SetStateAction<ColumnDefinition[]>>
) {
	const columns = await Promise.all(
		columnsDefinition.map(async (columnDefinition) => {
			let column = columnDefinition;
			// Нет смысла использовать getValue, если есть template
			if (column.getValue || column.template) {
				if (column.template) {
					// Создаем кастомные ячейки - React-ноды
					const cells = await createCells(noodlNode, items, column.template);
					// Выдаем для каждой строки свою React-ноду, сказав баблитеке,
					// что ее нужно отрисовывать, присвоив ноду в пезультат выполнения render
					column.render = (record) => cells.find((i) => i.itemId === record.id)?.reactNode;
					// Обарачиваем render в getValue. В данном случае, React-нода - это литерал в виде текста.
					// Если getValue выдаст массив или объект, будет ошибка, о чем руганется Noodl.
				} else if (column.getValue) column.render = (record) => column.getValue?.(record);
			}

			return column;
		})
	);
	setColumns(columns);
}

async function createCells(noodlNode: NoodlNode, items: Item[], template: string) {
	return Promise.all(
		items.map(async (item) => {
			// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
			const group = noodlNode.nodeScope.createPrimitiveNode('Group');
			// Стили - занимает всю ширину достуного места
			group.setStyle({ flex: '1 0 100%' });
			// Используем шаблон и присваиваем новый id
			const newNode = await noodlNode.nodeScope.createNode(template, nanoid(), {
				// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
				_forEachModel: Noodl.Object.create(item),
				// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
				_forEachNode: noodlNode
			});
			// Добавляем в группу Noodl созданную ноду
			group.addChild(newNode);
			// Здесь мы именно запускаем render, который возвращает React-ноду
			return { itemId: item.id, reactNode: group.render() };
		})
	);
}

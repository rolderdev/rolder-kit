/* Модель кастомных ячеек. */

import set from 'just-safe-set';
import { nanoid } from 'nanoid';
import { type Store } from '../store/store';
import type { Column } from './columnModel';

// Метод создает кастомные ячейки для всех колонок и items, у которых их еще нет.
export const setTemplateCells = async (s: Store) => {
	const templateColumns = s.cold.columnsDefinition.get().filter((i) => i.type && i.template);
	if (templateColumns.length) {
		const items = s.cold.items.get() || [];
		await Promise.all(
			templateColumns.map((column) =>
				Promise.all(
					items.map(async (item) => {
						if (!s.templateCells.get()[column.idx as number]?.[item.id]) {
							// Запишем новое состояние для каждого item. Это не порождает рендеры.
							const reactNode = await getTemplateCell(s, item.id, column);
							s.set((state) => {
								set(state.templateCells, `${column.idx}.${item.id}`, reactNode);
							});
						}
					})
				)
			)
		);
	}
};

// Метод создает React-ноду для кастомной ячейки.
const getTemplateCell = async (s: Store, itemId: string, column: Partial<Column>) => {
	const noodlNode = s.noodlNode.get();
	// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
	const group = noodlNode.nodeScope.createPrimitiveNode('Group');
	// Используем шаблон и присваиваем новый id
	const newNode = await noodlNode.nodeScope.createNode(column.template, nanoid(), {
		// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне
		_forEachModel: Noodl.Objects[itemId],
		// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
		_forEachNode: noodlNode,
	});
	// Добавляем в группу Noodl созданную ноду
	group.addChild(newNode);
	// Здесь мы именно запускаем render, который возвращает React-ноду
	return group.render() as React.ReactNode;
};

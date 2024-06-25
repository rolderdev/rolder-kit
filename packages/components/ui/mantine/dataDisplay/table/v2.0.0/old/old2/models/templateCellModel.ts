/* Модель кастомной ячейки. Используется как кеш, чтобы не создавать дорогостоящие ячейки повторно.
Кастомные ячейки нужно создавать до подачи имзенений в модель колонки. */

import { flow, t, type Instance } from 'mobx-state-tree';
import type { NoodlNode } from '@packages/node';
import type { Item } from 'types';
import createCustomCells from '../funcs/createCustomCells';
import type { Column } from './columnModel';

interface TemplateCell extends Instance<typeof templateCellModel> {}
// Структура. templateCells: содержит map, где ключ - item id, значение - массив с объектами, где ключ - индекс колонки, значение - React-нода.
// Для кеша такая структура удобна, в колонках организовано иначе.
const templateCellModel = t
	.model('TemplateCell', {
		templateCells: t.map(t.array(t.model({ columnIdx: t.identifierNumber, reactNode: t.frozen<React.ReactNode>() })))
	})
	.actions((self) => ({
		// Функция создает новые кастомные ячейки и удаляет старые.
		// Это функция-генератор - https://learn.javascript.ru/generator
		setTemplateCells: flow(function* setTemplateCells(noodlNode: NoodlNode, columns: Column[], items: Item[]) {
			if (columns.some((i) => i.type === 'template' && i.template)) {
				const currentItemIds = Array.from(self.templateCells.keys());

				// Добавление
				const newItems = items.filter((i) => !currentItemIds.includes(i.id));
				if (newItems.length) {
					const newTemplateCells: Map<string, { columnIdx: number; reactNode: React.ReactNode }[]> = yield createCustomCells(
						noodlNode,
						columns,
						newItems.map((i) => i.id)
					); // yield - как await в асинхронной функции
					for (let [itemId, itemColumnsCells] of newTemplateCells) {
						self.templateCells.set(itemId, itemColumnsCells);
					}
				}

				// Удаление
				const toDeleteItemIds = currentItemIds.filter((i) => !items.map((i) => i.id).includes(i));
				if (toDeleteItemIds.length) toDeleteItemIds.map((i) => self.templateCells.delete(i));
			}

			// Возвращаем обновленное состояние
			return self.templateCells;
		})
	}));

export { templateCellModel, type TemplateCell };

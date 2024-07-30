/* Модель кастомных ячеек. */

import set from 'just-safe-set';
import getTemplateCell from '../funcs/getTemplateCell';
import { type Store } from '../store';

// Метод создает кастомные ячейки для всех колонок и items, у которых их еще нет.
export const setTemplateCells = async (store: Store) => {
	const templateColumns = store.columns.get().filter((i) => i.type && i.template);
	if (templateColumns.length) {
		// Нужно добыть новые ячейки разом, чтобы записать в хранилище один раз.
		await Promise.all(
			templateColumns.map((column) =>
				Promise.all(
					store.items.get().map(async (item) => {
						if (!store.templateCells.get()[column.idx]?.[item.id]) {
							// Запишем новое состояние для каждого item. Это не порождает рендеры.
							const reactNode = await getTemplateCell(store, item.id, column.idx);
							store.set((s) => {
								set(s.templateCells, `${column.idx}.${item.id}`, reactNode);
							});
						}
					})
				)
			)
		);

		// Установим готовность для первого рендера.
		if (!store.templateCellsReady.get() && templateColumns.length === Object.keys(store.templateCells.get()).length)
			store.templateCellsReady.set(true);
	}
};

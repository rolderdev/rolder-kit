/* Модель кастомных ячеек. */

import set from 'just-safe-set';
import getTemplateCell from '../funcs/getTemplateCell';
import { type Store } from '../store';

// Метод создает кастомные ячейки для всех колонок и items, у которых их еще нет.
export const setTemplateCells = async (store: Store) => {
	const templateColumns = store.columns.get().filter((i) => i.type && i.template);
	if (templateColumns.length) {
		// Нужно добыть новые ячейки разом, чтобы записать в хранилище один раз.
		const newTemplateCells: Record<number, Record<string, React.ReactNode>> = {};
		await Promise.all(
			templateColumns.map((column) =>
				Promise.all(
					store.items.get().map(async (item) => {
						if (!store.templateCells.get()[column.idx]?.[item.id]) {
							set(newTemplateCells, `${column.idx}.${item.id}`, await getTemplateCell(store, item.id, column.idx));
						}
					})
				)
			)
		);

		store.templateCells.assign(newTemplateCells); // assign тригернет только изменения.
		// Установим готовность для первого рендера.
		if (!store.templateCellsReady.get() && templateColumns.length === Object.keys(newTemplateCells).length)
			store.templateCellsReady.set(true);
	}
};

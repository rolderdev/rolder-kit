import type { Row } from '../models/rowMoldel';
import type { Store } from '../store/store';
import setExpansionRow from './setExpansionRow';
import setTemplateCell from './setTemplateCell';

export default function (store: Store, row: Row) {
	const columns = store.getState().columns;

	// Создадим кастомные ячейки асинхронно, отдав в функцию set.
	if (columns.some((i) => i.type === 'template' && i.template)) {
		Noodl.Object.create(row.item); // Создадим для реактивности кастомной ячейки на уровне Noodl.
		columns.map((column) => {
			if (column.type === 'template' && column.template) {
				// Создаем кастомную ячейку только когда ее нет.
				if (!store.getState().rows.get(row.id)?.templateCells.get(column.idx)) {
					row.ready = false; // Установим стсояние для запуска скелетонов при первом рендере строки.
					row.state.templateCells = false;
					setTemplateCell(store, column, row);
					// Нужно восстановить кастомную ячейку.
				} else row.templateCells.set(column.idx, store.getState().rows.get(row.id)?.templateCells.get(column.idx));
			}
		});
	}

	// Создадим разворачиваемую строку асинхронно, отдав в функцию set.
	if (store.getState().tableProps.expansion.enabled) {
		Noodl.Object.create(row.item); // Создадим для реактивности разворачиваемой строки на уровне Noodl.
		// Создаем разворачиваемую строку только когда ее нет.
		if (!store.getState().rows.get(row.id)?.expansionRow) {
			row.ready = false; // Установим стсояние для запуска скелетонов при первом рендере строки.
			row.state.expansionRow = false;
			setExpansionRow(store, row);
		}
		// Нужно восстановить разворачиваемую строку.
		else row.expansionRow = store.getState().rows.get(row.id)?.expansionRow;
	}

	return row;
}

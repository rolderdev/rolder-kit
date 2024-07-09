/* Модель item. */

import { z } from 'zod';
import type { Item } from 'types';
import type { Store } from '../store';
import isArrayEqual from '../funcs/isArrayEqual';
import type { Props } from '../../types';
import { setSelectedItems } from './multiSelectionModel';

// В item нам важен только id. По сути, эта схема предъявит разработчику требование - item может быть люой структуры, но id обязателен.
const itemsSchema = z.array(z.object({ id: z.string() }).passthrough());

// Метод проверки item на id.
export const getItems = (p: Props) => {
	const newItems = p.items || [];
	// Создадим Noodl-объекты для реактивности в кастомных ячейках или разворачиваемых строках.
	if (p.columnsDefinition?.some((i) => i.type === 'template') || p.expansion) newItems.map((i) => Noodl.Object.create(i));
	return itemsSchema.parse(newItems) as Item[];
};

// Метод обновляет состояние items и зависимости.
export const setItems = (store: Store, items?: Item[]) => {
	const newItems = items || [];
	if (!isArrayEqual(store.items.get(), newItems)) {
		store.items.assign(newItems);
		if (store.columns.get().some((i) => i.type === 'template') || store.tableProps.expansion.enabled.get()) {
			// Заменим Noodl-объекты для реактивности в кастомных ячейках или разворачиваемых строках.
			newItems.map((i) => Noodl.Object.create(i));
		}
		// Если это корень, инициализируем иерархию дочерних таблиц. В том числе повторно.
		if (!store.isChild.get()) store.scope.get()?.setHierarchy(store.tableId.get(), newItems);
		// Обновим выбранные строки, если изменение items на это повлияло.
		setSelectedItems(store, store.selectedItems.get());
	}
};

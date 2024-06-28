/* Модель item. */

import { z } from 'zod';
import type { Item } from 'types';
import type { Store } from '../store';
import isArrObjEquals from '../funcs/isArrayEqual';
import getExpansionRow from '../funcs/getExpansionRow';
import type { Props } from '../../types';

// В item нам важен только id. По сути, эта схема предъявит разработчику требование - item может быть люой структуры, но id обязателен.
const itemsSchema = z.array(z.object({ id: z.string() }).passthrough());

// Метод проверки item на id.
export const getItems = (p: Props) => {
	const newItems = p.items || [];
	// Создадим Noodl-объекты для реактивности в кастомных ячейках или разворачиваемых строках.
	if (p.columnsDefinition?.some((i) => i.type === 'template') || p.expansion) newItems.map((i) => Noodl.Object.create(i));
	return itemsSchema.parse(newItems) as Item[];
};

// Метод обновляет состояние items и expansionRows.
export const setItems = (store: Store, items?: Item[]) => {
	const newItems = items || [];
	if (!isArrObjEquals(store.items.get(), newItems)) {
		store.items.assign(newItems);
		if (store.columns.get().some((i) => i.type === 'template') || store.tableProps.expansion.enabled.get()) {
			// Заменим Noodl-объекты для реактивности в кастомных ячейках или разворачиваемых строках.
			newItems.map((i) => Noodl.Object.create(i));
		}
	}
};

// Метод создает расширяемые строки для всех items, у которых их еще нет.
export const setExpansionRows = (store: Store) => {
	if (store.tableProps.expansion.enabled.get()) {
		Promise.all(
			store.items.get().map(async (item) => {
				if (!store.expansionRows[item.id].get()) {
					store.expansionRows[item.id].set(await getExpansionRow(store, item.id));
				}
			})
		);
	}
};

/* Модель item. */

import { z } from 'zod';
import isEqual from 'lodash.isequal';
import type { Item } from 'types';
import type { Props } from '../../types';
import type { Store } from '../store/store';
import isArrayEqual from '../funcs/isArrayEqual';

// В item нам важен только id. По сути, эта схема предъявит разработчику требование - item может быть любой структуры, но id обязателен.
const itemsSchema = z.array(z.object({ id: z.string() }).passthrough());

// Метод проверки на наличие id.
export const getItems = (items: Item[]) => itemsSchema.parse(items) as Item[];

// Метод проверки изменения содержани items.
export const itemsContentChanged = (s: Store, items: Item[]) => {
	const newItems = getItems(items); // Проверим на id.
	/* const oldIds = s.cold.items.get()?.map((i) => i.id);
	const newIds = newItems.map((i) => i.id);
	if (!oldIds) return true;
	if (!isEqual(oldIds.sort(), newIds.sort())) return true; */
	if (!isArrayEqual(s.cold.items.get() || [], newItems)) return true;
	else return false;
};

// Метод проверки изменения состава items.
export const itemsChanged = (s: Store, items?: Item[]) => {
	// Не будем устанавливать items, пока они не прилетели
	if (items) {
		const newItems = getItems(items);
		const oldIds = s.cold.items.get()?.map((i) => i.id);
		const newIds = newItems.map((i) => i.id);
		if (!oldIds) return true; // Считаем, что изменились, если в холодном хранилище еще не было items.
		if (!isEqual(oldIds.sort(), newIds.sort())) return true;
	}
	return false;
};

export const setItems = (s: Store, p: Props) => s.cold.items.set(p.items);

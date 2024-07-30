/* Модель item. */

import { z } from 'zod';
import get from 'just-safe-get';
import type { Item } from 'types';
import type { Store } from '../store';
import isArrayEqual from '../funcs/isArrayEqual';
import type { Props } from '../../types';

// В item нам важен только id. По сути, эта схема предъявит разработчику требование - item может быть люой структуры, но id обязателен.
const itemsSchema = z.array(z.object({ id: z.string() }).passthrough());

// Метод проверки item на id.
export const getItems = (p: Props) => {
	let newItems = p.items || [];

	/* // Найдем дефолтную сортировку
	const defaultSortColumn = p.columnsDefinition?.find((i) => i.sort);
	// Отсоритруем items, если установлен фронтовый тип сортировки и установлен дефолт.
	if (p.sortType === 'frontend' && (defaultSortColumn?.sort === 'asc' || defaultSortColumn?.sort === 'desc'))
		newItems = R.libs.sort(newItems).by([{ [defaultSortColumn.sort]: (i: any) => get(i, defaultSortColumn.accessor) }]); */

	// Создадим Noodl-объекты для реактивности в кастомных ячейках или разворачиваемых строках.
	if (p.columnsDefinition?.some((i) => i.type === 'template') || p.expansion) newItems.map((i) => Noodl.Object.create(i));
	return itemsSchema.parse(newItems) as Item[];
};

// Метод обновляет состояние items и зависимости.
export const setItems = (store: Store, p: Props) => {
	const toCompareItems = p.items || [];
	if (!isArrayEqual(store.items.get(), toCompareItems)) {
		const newItems = getItems(p);
		store.items.assign(newItems);

		// Если это корень, инициализируем иерархию дочерних таблиц. В том числе повторно.
		if (!store.isChild.get()) store.scope.get()?.setHierarchy(store.tableId.get(), newItems);
		// Обновим выбранные строки, если изменение items на это повлияло.
		store.setSelectedItems(store.selectedItems.get());
	}
};

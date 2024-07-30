/* Модель колонки. */

import { z } from 'zod';
import type { Store } from '../store/store';
import type { Props } from '../../types';
import Render from '../renders/Render';
import type { Item } from 'types';
import isArrayEqual from '../funcs/isArrayEqual';

// Схема задает типы данных и их дефолты. Служит источником создание колонок для библиотеки.
export const columnSchema = z.object({
	idx: z.number(),
	type: z.enum(['accessor', 'getValue', 'template']),
	accessor: z.string().optional(),
	getValue: z
		.function()
		// Важно не проверять иерархию, т.к. проверка ломает ее, поэтому z.any()
		.args(z.object({}).passthrough(), z.array(z.object({}).passthrough()), z.any())
		.returns(z.union([z.string(), z.number()]).default('Empty getValue return')) // Проверим, что разарботчик выдает, что нужно или руганемся.
		.optional(),
	template: z.string().optional(),
	width: z.union([z.string(), z.number()]).default('100%'),
	sort: z.union([z.boolean(), z.enum(['asc', 'desc'])]).optional(),
});

export type Column = z.infer<typeof columnSchema>;

// Проверка валидности.
export const getColumnsDefinition = (p: Props) => {
	// Проверим схему на валидность.
	p.columnsDefinition?.map((i, idx) => columnSchema.parse({ ...i, idx }));
	// Вернем исходные колонки добавив индекс - нужен для кастомных ячеек.
	return p.columnsDefinition?.map((i, idx) => ({ ...i, idx })) || [];
};

export const columnsDefinitionChanged = (store: Store, p: Props) => {
	const newColumnsDefinition = getColumnsDefinition(p);
	if (!isArrayEqual(store.cold.columnsDefinition.get(), newColumnsDefinition)) return true;
	else return false;
};

// Сохранение исходной схемы для сравнения.
export const setColumnsDefinition = (store: Store, p: Props) => {
	const newColumnsDefinition = getColumnsDefinition(p);
	store.cold.columnsDefinition.set(newColumnsDefinition);
};

// Создает колонки для библиотеки. Для первичного состояния.
export const getColumns = (p: Props) => {
	// Возьмем исходную схему, проверив ее на валидность.
	const columnsDefinition = getColumnsDefinition(p);
	// Создадим колонки в нужном для библиотеки формате, сохранив наши расширения.
	const columns = columnsDefinition.map((i, idx) => ({
		...i, // Разработчик может добавить любые параметры из библиотеки.
		idx, // Для поиска колонки в ячейках.
		accessor: `${i.accessor || i.idx}`, // Добавим accessor, если его нет. Это обязательный параметр для библиотеки.
		sortable: p.sort && i.sort ? true : false, // Установим сортировку.
	}));

	// Вернем колонки, добавив компоненту отрисовки ячеек.
	return columns.map((i) => ({
		...i,
		render: (item: Item) => <Render expansionEnabled={p.expansion ? true : false} column={i} item={item} />,
	}));
};

// Создает колонки для библиотеки. Для изменений. Как выше, но берет данные с хранилища.
export const getHotColumns = (s: Store) => {
	const columnsDefinition = s.cold.columnsDefinition.get();
	const columns = columnsDefinition.map((i, idx) => ({
		...i,
		idx,
		accessor: `${i.accessor || i.idx}`,
		sortable: s.cold.tableProps.sort.enabled.get() && i.sort ? true : false,
	}));
	return columns.map((i) => ({
		...i,
		render: (item: Item) => (
			<Render expansionEnabled={s.cold.tableProps.expansion.enabled.get() ? true : false} column={i as Column} item={item} />
		),
	}));
};

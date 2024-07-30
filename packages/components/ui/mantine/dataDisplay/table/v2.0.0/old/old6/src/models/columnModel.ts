/* Модель колонки. */

import { z } from 'zod';
import type { Store } from '../store';
import isArrayEqual from '../funcs/isArrayEqual';

// Схема задает типы данных и их дефолты.
export const columnSchema = z.object({
	libColumn: z.object({}).passthrough(), // Здесь храним стандартные настройки библиотеки.
	idx: z.number(),
	type: z.enum(['accessor', 'getValue', 'template']),
	accessor: z.string(),
	getValue: z
		.function()
		// Важно не проверять иерархию, т.к. проверка ломает ее, поэтому z.any()
		.args(z.object({}).passthrough(), z.array(z.object({}).passthrough()), z.any())
		.returns(z.union([z.string(), z.number(), z.nan()]).optional()) // Проверим, что разарботчик выдает, что нужно или руганемся.
		.optional(),
	template: z.string().optional(),
	expander: z.boolean().default(false),
	width: z.union([z.string(), z.number()]).optional(),
	sort: z.union([z.boolean(), z.enum(['asc', 'desc'])]).optional(),
});

export type Column = z.infer<typeof columnSchema>;

// Метод преобразует схемы колонок.
export const getColumns = (columnsDefinition: Column[]) => {
	// ...i - проверяем и сохраняем важные для нас настройки, libColumn - сохраняем любые настройки разработчика.
	return columnsDefinition.map((i, idx) =>
		// Нужно подставить accessor, если его нет. Библиотека использует его как id, а у нас он опционален.
		columnSchema.parse({
			...i,
			idx,
			accessor: `${i.accessor || i.idx}`,
			libColumn: { ...i, width: i.width || '100%', sortable: i.sort ? true : false },
		})
	);
};

// Метод обновляет состояние колонок.
export const setColumns = (store: Store, columnsDefinition?: Column[]) => {
	if (columnsDefinition) {
		const newColumns = getColumns(columnsDefinition);
		if (
			!isArrayEqual(
				store.columns.get().map((i) => i.libColumn),
				newColumns.map((i) => i.libColumn)
			)
		) {
			store.columns.assign(newColumns);
		}
	}
};

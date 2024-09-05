/* Модель колонки. */

import { z } from 'zod';
import type { Store } from '../../types';
import flatUpdate from '../funcs/flatUpdate';

// Схема задает типы данных и их дефолты.
const columnSchema = z.object({
	columnIdx: z.number(),
	type: z.enum(['accessor', 'getValue', 'template']),
	accessor: z.string().optional(),
	title: z.string(),
	getValueStringFunc: z.string().optional(),
	template: z.string().optional(),
	width: z.union([z.string(), z.number()]).optional()
});

type Column = z.infer<typeof columnSchema>;
export type ColumnDefinition = Column & { getValue?: () => void };

// Функция проверяет корректность схемы колонок.
const getColumns = (columnsDefinition: ColumnDefinition[]) => {
	// ref отключает реактивность
	return columnsDefinition.map((def, columnIdx) =>
		columnSchema.parse({
			...def,
			columnIdx,
			// proxy не умеет хранитиь функции, зато быстро сравнивает текст.
			// Это позволяет сделать код функции реактивным. Разработчику не нужно перезагружать таблицу.
			getValueStringFunc: def.getValue?.toString()
		})
	);
};

// Функция обновляет состояние колонок.
const setColumns = (store: Store, columnsDefinition: ColumnDefinition[]) => {
	// Создадим новые колонки, проверив корректность.
	// flatUpdate - обновляет ключи по отдельности, обеспечивая точечную реактивность вложенных объектов.
	getColumns(columnsDefinition).map((def, columnIdx) => flatUpdate(def, store.columns[columnIdx]));
};

export { getColumns, setColumns, type Column };

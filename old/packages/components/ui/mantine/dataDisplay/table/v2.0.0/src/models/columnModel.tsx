/* Модель колонки. */

import { z } from 'zod';
import type { Store } from '../store/store';
import type { Props } from '../../types';
import Render from '../renders/Render';
import type { Item } from 'types';
import isArrayEqual from '../funcs/isArrayEqual';

// Схема для проверки колонок и установки типов данных.
export const columnSchema = z.object({
	idx: z.number(),
	type: z.enum(['accessor', 'getValue', 'template']),
	accessor: z.string().optional(),
	getValue: z
		.function()
		// Важно не проверять иерархию, т.к. проверка ломает ее, поэтому z.any()
		.args(z.object({ id: z.string() }).passthrough(), z.array(z.object({ id: z.string() }).passthrough()), z.any())
		.returns(z.union([z.string(), z.number()]).default('Empty getValue return')) // Проверим, что разарботчик выдает, что нужно или руганемся.
		.optional(),
	template: z.string().optional(),
	width: z.union([z.string(), z.number()]).optional(),
	sort: z.union([z.boolean(), z.enum(['asc', 'desc'])]).optional(),
	sortFunc: z
		.function()
		.args(z.array(z.object({ id: z.string() }).passthrough()), z.string(), z.string())
		.returns(z.array(z.object({ id: z.string() }).passthrough()))
		.optional(),
});

export type Column = z.infer<typeof columnSchema>;

export const columnsDefinitionChanged = (s: Store, p: Props) => {
	const newColumnsDefinition = p.columnsDefinition?.map((i, idx) => ({ ...i, idx })) || [];
	if (!isArrayEqual(s.cold.columnsDefinition.get(), newColumnsDefinition)) return true;
	else return false;
};

// Сохранение исходной схемы для сравнения.
export const setColumnsDefinition = (s: Store, p: Props) => {
	const newColumnsDefinition = p.columnsDefinition?.map((i, idx) => ({ ...i, idx })) || [];
	newColumnsDefinition.map((i) => columnSchema.parse(i)); // Проверим валидность.
	s.cold.columnsDefinition.set(newColumnsDefinition);
};

// Колонки для библиотеки.
export const getHotColumns = (s: Store) =>
	s.cold.columnsDefinition
		.get()
		.map((i, idx) => ({
			...i,
			idx,
			accessor: `${i.accessor || i.idx}`,
			sortable: s.cold.tableProps.sort.enabled.get() && i.sort ? true : false,
		}))
		.map((i) => ({
			...i,
			render: (item: Item) => (
				<Render expansionEnabled={s.cold.tableProps.expansion.enabled.get() ? true : false} column={i as Column} item={item} />
			),
		}));

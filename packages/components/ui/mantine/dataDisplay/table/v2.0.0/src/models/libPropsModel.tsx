/* Модель настроек библиотеки. */

import { z } from 'zod';
import isEqual from 'lodash.isequal';
import type { DataTableProps } from 'mantine-datatable';
import type { CheckboxProps } from '@mantine/core';
import type { Item } from 'types';
import type { Props } from '../../types';
import type { Store } from '../store';
import stringifyObjectFuncs from '../funcs/stringifyObjectFuncs';

// Схема задает типы данных и их дефолты.
const libPropsSchema = z.object({
	// Base
	textSelectionDisabled: z.boolean().default(false),
	// Layout
	noHeader: z.boolean().default(false),
	// Dimensions
	minHeight: z.string().default('84px'),
	horizontalSpacing: z.string().default('sm'),
	verticalSpacing: z.string().default('xs'),
	fz: z.string().default('sm'),
	// Table styles
	shadow: z.string().default('sm'),
	withTableBorder: z.boolean().default(false),
	borderRadius: z.string().default('md'),
	withColumnBorders: z.boolean().default(false),
	emptyState: z.string().default('Записей не найдено'),
	// Row styles
	withRowBorders: z.boolean().default(true),
	striped: z.boolean().default(false),
	stripedColor: z.string().default('white'), // Нужно перезаписать, иначе наследуется с родительской таблицы.
	highlightOnHover: z.boolean().default(false),
	highlightOnHoverColor: z.string().default('white'), // Нужно перезаписать, иначе наследуется с родительской таблицы.
	// Loader styles
	loaderSize: z.string().default('lg'),
	loaderType: z.string().default('dots'),
	loaderColor: z.string().default('blue'),
	loaderBackgroundBlur: z.number().default(0.5),
	// Multi selection
	allRecordsSelectionCheckboxProps: z.object({}).passthrough().optional(),
	selectionCheckboxProps: z.object({}).passthrough().optional(),
	getRecordSelectionCheckboxProps: z.function().optional(),
	getRecordSelectionCheckboxPropsDev: z.function().optional(),
	selectionColumnStyle: z.object({}).passthrough().optional(),
	isRecordSelectable: z
		.function()
		.args(z.object({ id: z.string() }).passthrough())
		.returns(z.boolean())
		.optional(),
	// Sort
	sortIcons: z.object({ sorted: z.any(), unsorted: z.any() }).optional(),
});

export type LibProps = z.infer<typeof libPropsSchema>;

// Метод проверяет прилетевшие знаяения с портов и восстаналвивает дефолты, если значение не прилетело.
export const getLibProps = (p: Props, isChild: boolean) =>
	libPropsSchema.parse({
		...p,
		shadow: isChild ? 'none' : p.shadow || 'sm', // Если таблица дочерняя, убираем тень
		borderRadius: isChild ? '0px' : p.borderRadius || 'md', // округление.
		sortIcons: (() => {
			const SortedIcon = R.libs.icons[p.sortedIcon || 'IconArrowUp'];
			const UnsortedIcon = R.libs.icons[p.unsortedIcon || 'IconSelector'];
			return {
				sorted: SortedIcon && <SortedIcon size={14} {...p.customProps?.sortedIcon} />,
				unsorted: UnsortedIcon && <UnsortedIcon size={14} {...p.customProps?.unsortedIcon} />,
			};
		})(),
		...p.customProps?.lib, // Дадим разработчику рулить.
		...p.customProps, // Остальные настройки, которые проверит Zod.
	});

// Метод обновляет состояние настроек.
export const setLibProps = (store: Store, p: Props) => {
	const newProps = getLibProps(p, store.isChild.get());

	// Подменим параметры чекбокса, если используется TableScope.
	// Такой же финт ушами, но для чекбокса в заголовке делается в useHeaderCheckboxProps.
	// Делаем это здесь, т.к. libProps могут прилетать уже после монтирование, особенно в дочерних таблицах.
	if (store.scope.get()) {
		const getRecordSelectionCheckboxProps: DataTableProps<Item>['getRecordSelectionCheckboxProps'] = (record, idx) => {
			// Запустим функцию разработчика, чтобы записать indeterminate поверх.
			const checkBoxProps: CheckboxProps = p.customProps?.getRecordSelectionCheckboxProps?.(record, idx) || {};
			// Реактивность только на строку.
			const indeterminate = store.scope.get()?.indeterminated.use((s) => s[record.id]);
			checkBoxProps.indeterminate = indeterminate;
			return checkBoxProps;
		};

		newProps.getRecordSelectionCheckboxProps = getRecordSelectionCheckboxProps as any;
		// Нужно сохранить функцию разработчика, чтобы обновлять ее при изменениях.
		newProps.getRecordSelectionCheckboxPropsDev = p.customProps?.getRecordSelectionCheckboxProps as any;
	}

	if (!isEqual(stringifyObjectFuncs(store.libProps.get()), stringifyObjectFuncs(newProps))) store.libProps.assign(newProps);
};

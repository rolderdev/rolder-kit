/* Модель настроек библиотеки. */

import { z } from 'zod';
import isEqual from 'lodash.isequal';
import type { Props } from '../../types';
import type { Store } from '../store/store';
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
	selectionCheckboxProps: z.object({}).passthrough().optional(),
	getRecordSelectionCheckboxProps: z.function().optional(),
	selectionColumnStyle: z.object({}).passthrough().optional(),
	isRecordSelectable: z.function().optional(),
	// Sort
	sortIcons: z.object({ sorted: z.any(), unsorted: z.any() }).optional(),
});

export type LibProps = z.infer<typeof libPropsSchema>;

// Метод проверяет прилетевшие знаяения с портов и восстаналвивает дефолты, если значение не прилетело.
export const getLibProps = (p: Props) =>
	libPropsSchema.parse({
		...p,
		shadow: p.isParentTable ? 'none' : p.shadow || 'sm', // Если таблица дочерняя, убираем тень
		borderRadius: p.isParentTable ? '0px' : p.borderRadius || 'md', // и округление.
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
export const setLibProps = (store: Store, p: Props) =>
	store.setState((s) => {
		// Сравниваем праметры, включая функции и вложенный customProps.
		const newProps = getLibProps(p);
		if (!isEqual(stringifyObjectFuncs(s.libProps), stringifyObjectFuncs(newProps))) return { libProps: newProps };
		else return s;
	});

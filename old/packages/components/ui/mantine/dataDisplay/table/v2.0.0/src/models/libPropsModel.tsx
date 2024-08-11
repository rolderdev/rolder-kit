/* Модель настроек библиотеки. */

import { z } from 'zod';
import isEqual from 'lodash.isequal';
import type { DataTableProps } from 'mantine-datatable';
import type { CheckboxProps } from '@mantine/core';
import type { Item } from 'types';
import type { Props } from '../../types';
import type { Store } from '../store/store';
import stringifyObjectFuncs from '../funcs/stringifyObjectFuncs';

// Схема задает типы данных и их дефолты.
const libPropsSchema = z.object({
	customProps: z.object({}).passthrough().optional(), // Позволим разработчику рулить.
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
	// Сохраним параметры чекбокса в заголовке под другим имененм, чтобы не дать разработчику перезаписать ее. Она нужна нам в таблице.
	allRecordsSelectionCheckboxPropsDev: z.object({}).passthrough().optional(),
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

// Метод проверяет прилетевшие значения с портов и восстаналвивает дефолты, если значение не прилетело.
export const getLibProps = (s: Store, p: Props) => {
	// Проверим базовые параметры.
	const libProps = libPropsSchema.parse({
		...p,
		shadow: s.isChild.get() ? 'none' : p.shadow || 'sm', // Если таблица дочерняя, убираем тень
		borderRadius: s.isChild.get() ? '0px' : p.borderRadius || 'md', // и округление.
		// Уберем прилипание колоник с чекбоксом, если таблица часть иерархии.
		selectionColumnStyle:
			p.expansion || s.isChild.get()
				? { position: 'relative', '--mantine-datatable-shadow-background-left': 'none', borderLeft: 'unset' }
				: undefined,
		// Заменим встроенную функцие запрета выбора своей, просто чтобы все было одинаково.
		isRecordSelectable: p.multiSelectionFilterFunc,
		// Сохраним параметры чекбокса в заголовке под другим имененм, чтобы не дать разработчику перезаписать ее.
		allRecordsSelectionCheckboxPropsDev: p.customProps?.allRecordsSelectionCheckboxProps,
		// Удалим ее из стандартного набора параметров библиотеки.
		allRecordsSelectionCheckboxProps: undefined,
		sortIcons: (() => {
			const SortedIcon = R.libs.icons[p.sortedIcon || 'IconArrowUp'];
			const UnsortedIcon = R.libs.icons[p.unsortedIcon || 'IconSelector'];
			return {
				sorted: SortedIcon && <SortedIcon size={14} {...p.customProps?.sortedIcon} />,
				unsorted: UnsortedIcon && <UnsortedIcon size={14} {...p.customProps?.unsortedIcon} />,
			};
		})(),
	});

	// Подменим параметры чекбокса, если используется TableScope.
	// Такой же финт ушами, но для чекбокса в заголовке делается в useHeaderCheckboxProps.
	// Делаем это здесь, т.к. libProps могут прилетать уже после монтирование, особенно в дочерних таблицах.
	if (s.scopeStore.get()) {
		const getRecordSelectionCheckboxProps: DataTableProps<Item>['getRecordSelectionCheckboxProps'] = (record, idx) => {
			// Запустим функцию разработчика, чтобы записать indeterminate поверх.
			const checkBoxProps: CheckboxProps = p.customProps?.getRecordSelectionCheckboxProps?.(record, idx) || {};
			// Реактивность только на строку.
			const indeterminate = s.scopeStore.get()?.selectionState[record.id].use((s) => s === 'indeterminate');
			checkBoxProps.indeterminate = indeterminate;
			// Расчет отсупа функцией разработчика.
			const paddingLeftPostion = s.hot.tableProps.rowStyles.paddingLeftPostion.use();
			const level = s.level.use();
			const pl = s.hot.tableProps.use((state) =>
				state.paddingLeftFunc?.(
					level,
					s.hot.items.get((i) => i.find((i) => i.id === record.id))
				)
			);
			checkBoxProps.pl = paddingLeftPostion === 'checkbox' ? pl : undefined;

			return checkBoxProps;
		};

		libProps.getRecordSelectionCheckboxProps = getRecordSelectionCheckboxProps as any;
	}

	return libProps;
};

export const libPropsChanged = (s: Store, p: Props) => {
	const newProps = getLibProps(s, p);
	// Сравним вручную, т.к. store не может это делать для функций.
	if (!isEqual(stringifyObjectFuncs(s.cold.libProps.get()), stringifyObjectFuncs(newProps))) return true;
	else return false;
};

export const setLibProps = (s: Store, p: Props) => {
	const newProps = getLibProps(s, p);
	s.cold.libProps.set(newProps);
};

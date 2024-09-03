/* Модель настроек таблицы. */

import type { Props } from '../../node/definition';

export type TableProps = ReturnType<typeof setTableProps>;

// Устанавливает наши специфичные настройки таблицы.
export const setTableProps = (p: Props) => {
	const tableProps = {
		...R.libs.just.pick(p, [
			// Base
			'onRowClick',
			'clickFilterFunc',
			'singleSelectionFilterFunc',
			'paddingLeftFunc',
		]),
		rowStyles: {
			rowBackgroundColor: p.rowBackgroundColor || 'white',
			singleSelectionRowBgColor: p.singleSelectionRowBgColor || 'white',
			mutliSelectionRowBgColor: p.mutliSelectionRowBgColor || 'white',
			paddingLeftPostion: p.multiSelection ? 'checkbox' : p.expansion ? 'expander' : 'cell',
		},
		multiSelection: {
			enabled: p.multiSelection,
			useHierarchy: p.useSelectionHierarchy,
			filterFunc: p.multiSelectionFilterFunc,
		},
		expansion: {
			enabled: p.expansion,
			allowMultiple: p.allowMultiple,
			template: p.expansionTemplate,
			filterFunc: p.expansionFilterFunc,
			animationChildrenCount: p.animationChildrenCount || 25,
			collapseProps: {
				transitionDuration: 150,
				transitionTimingFunction: 'ease',
				animateOpacity: true,
				...p.customProps?.collapseProps,
			},
		},
	};

	p.store.tableProps = tableProps;
	return tableProps; // Только для типизации.
};

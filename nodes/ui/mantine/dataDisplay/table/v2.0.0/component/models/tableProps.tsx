/* Модель настроек таблицы. */

import type { DataTableSortStatus } from 'mantine-datatable';
import type { Props } from '../../node/definition';
import type { TableRecord } from './record';

export type TableProps = ReturnType<typeof setTableProps>;

// Устанавливает наши специфичные настройки таблицы.
export const setTableProps = (p: Props) => {
	const defaultSortColumnDef = p.columnsDefinition?.find((i) => typeof i.sort === 'string');

	const tableProps = {
		...R.libs.just.pick(p, [
			// Base
			'onRowClick',
			'clickFilterFunc',
			'singleSelectionFilterFunc',
			'useSingleSelectionHierarchy',
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
			useHierarchy: p.useMultiSelectionHierarchy,
			filterFunc: p.multiSelectionFilterFunc,
		},
		expansion: {
			enabled: p.expansion,
			allowMultiple: p.allowMultiple,
			template: p.expansionTemplate,
			useHierarchy: p.useExpansionHierarchy,
			filterFunc: p.expansionFilterFunc,
			animationChildrenCount: p.animationChildrenCount || 25,
			collapseProps: {
				transitionDuration: 150,
				transitionTimingFunction: 'ease',
				animateOpacity: true,
				...p.customProps?.collapseProps,
			},
		},
		sort: {
			enabled: p.sort,
			type: p.sortType,
			defaultState:
				typeof defaultSortColumnDef?.sort === 'string'
					? ({
							columnAccessor: defaultSortColumnDef.accessor || defaultSortColumnDef.sortPath,
							direction: defaultSortColumnDef.sort,
					  } satisfies DataTableSortStatus<TableRecord>)
					: undefined,
		},
	};

	p.store.tableProps = tableProps;
	return tableProps; // Только для типизации.
};

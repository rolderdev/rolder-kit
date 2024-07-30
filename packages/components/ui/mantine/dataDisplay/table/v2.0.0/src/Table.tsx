/* Сама таблица. */

import { memo } from 'react';
import { DataTable } from 'mantine-datatable';
import type { Item } from 'types';
import { useStore } from './store/store';
import onRowClickHandler from './funcs/onRowClickHandler';
import getCursorState from './funcs/getCursorState';
import ExpansionRow from './renders/ExpansionRow';
import { setSelectedItemsFromTable } from './models/multiSelectionModel';

import rowClasses from './styles/row.module.css';
import getRowBgColor from './funcs/getRowBgColor';

// memo остановит любой рендер пришедший сверху, кроме изменения fetching.
export default memo((_, ref) => {
	const s = useStore();
	if (!s) return;

	const fetching = s.fetching.use();
	// Поскольку обновляем состояние для талицы разом, норм здесь использовать деструктуризацию.
	const { libProps, tableProps, columns, items, selectedItems, expandedIds } = s.hot.use();

	//console.log('Table render >>>>>', Noodl.Objects[s.tableId.get()].content?.name); // Считаем рендеры пока разрабатываем
	return (
		<DataTable<Item>
			// Base
			fetching={fetching}
			columns={columns}
			records={fetching ? [] : items} // Не будем показывать items пока таблица не готова.
			onRowClick={onRowClickHandler(s)}
			// Row styles
			// Эти классы убирают лишние бордюры строк в развернутых таблицах.
			className={
				tableProps.expansion.enabled
					? libProps.withRowBorders
						? rowClasses['expansion-with-border']
						: rowClasses['expansion-without-border']
					: undefined
			}
			rowStyle={(record) => ({
				//['--mantine-primary-color-light']: 'transparent', // Сброс встроенных стилей включенного чекбокса.
				cursor: getCursorState(s, record), // Управление состоянием курсора.
			})}
			rowBackgroundColor={(record) =>
				tableProps.onRowClick === 'singleSelection' || tableProps.multiSelection ? getRowBgColor(record.id) : 'white'
			}
			// Multi selection
			selectedRecords={tableProps.multiSelection ? selectedItems || [] : undefined}
			onSelectedRecordsChange={(selectedItems) => setSelectedItemsFromTable(s, selectedItems)}
			// Заменим стандартные параметры чекбокса в заголовке.
			// Нам это нужно из-за варианта, когда в корне нет ни отдного checked, но есть 'indeterminate'.
			allRecordsSelectionCheckboxProps={(() => {
				// Подпишемся на изменение состояния чекбокса в TableScope. Это хук, но как-то работает прямо здесь.
				// Это позволяет не реднедрить всю таблицу корня повторно из-за смены состояния чекбокса.
				const indeterminate = s.scopeStore.get()?.selectionState[s.tableId.get()].use((s) => s === 'indeterminate');
				// Если разработчки указал свои параметры, сначала применим их.
				const p = libProps.allRecordsSelectionCheckboxPropsDev || {};
				if (!s.isChild.get()) p.indeterminate = indeterminate;
				return p;
			})()}
			// Expansion
			rowExpansion={
				tableProps.expansion.enabled
					? {
							allowMultiple: tableProps.expansion.allowMultiple,
							// Мы сами управляем событием клика, т.к. накладываем на него фильтрацию.
							// См. onRowClickHandler, ExpanderCell и getCursorState.
							trigger: 'never',
							collapseProps: tableProps.expansion.collapseProps,
							expanded: { recordIds: expandedIds || [] }, // Развернутые строки.
							content: ({ record, collapse }) => {
								// Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную
								Noodl.Objects[record.id].collapse = collapse;
								return <ExpansionRow itemId={record.id} />;
							},
					  }
					: undefined
			}
			// Sort
			/* sortStatus={sortState}
			onSortStatusChange={(state) => s.sortState.set(state)} */
			{...(libProps as any)} // Ломает типизацию
			{...libProps.customProps}
		/>
	);
});

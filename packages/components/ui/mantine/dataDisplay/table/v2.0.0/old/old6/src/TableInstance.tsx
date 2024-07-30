/* Сама таблица */

import { memo } from 'react';
import { DataTable } from 'mantine-datatable';
import type { Item } from 'types';
import { useStore } from './store';
import ExpansionRow from './renders/ExpansionRow';
import getRowBgColor from './funcs/getRowBgColor';
import onRowClickHandler from './funcs/onRowClickHandler';

import rowClasses from './styles/row.module.css';
import getCursorState from './funcs/getCursorState';
import render from './renders/render';
import { useAutoAnimate } from '@formkit/auto-animate/react';

// memo остановит любой рендер пришедший сверху, кроме изменения fetching.
export default memo((p: { fetching: boolean }) => {
	const store = useStore();
	if (!store) return;

	// Берем состояние по частям для точечной реактивности.
	const libProps = store.libProps.use();
	const columns = store.columns.use();
	const items = store.items.use();

	const onRowClick = store.tableProps.onRowClick.use();
	const multiSelection = store.tableProps.multiSelection.use();
	const selectedItems = store.selectedItems.use();

	const expansion = store.tableProps.expansion.use();
	const expandedIds = store.expandedIds.use();
	const withRowBorders = store.libProps.withRowBorders.get();

	const sortState = store.sortState.use();

	// Анимация
	const animation = store.tableProps.animation?.use();
	const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>();

	//console.log('Table render', expansion.enabled, withRowBorders); // Считаем рендеры пока разрабатываем
	return (
		// @ts-ignore
		<DataTable<Item>
			// Base
			fetching={p.fetching}
			columns={columns.map((column) => ({
				// Передадим в колонку только accessor и параметры библиотеки, которые задает разработчик.
				...column.libColumn,
				accessor: column.accessor,
				render: (item) => render(expansion.enabled, column, item),
			}))}
			// Тригерим только на смену id. Остальное решает ячейка.
			records={items}
			onRowClick={onRowClickHandler(store)}
			// Table styles
			bodyRef={animation ? bodyRef : undefined}
			// Row styles
			// Эти классы убирают лишние бордюры строк в развернутых таблицах.
			className={
				expansion.enabled
					? withRowBorders
						? rowClasses['expansion-with-border']
						: rowClasses['expansion-without-border']
					: undefined
			}
			// Не смог разобраться почему rowBackgroundColor не достаточно для установки стилей мульти-выбора.
			rowClassName={rowClasses['mantine-datatable-row']} // Сброс встроенных стилей выделенной строки.
			rowStyle={(record) => ({
				['--mantine-primary-color-light']: 'transparent', // Сброс встроенных стилей включенного чекбокса.
				cursor: getCursorState(store, record), // Управление состоянием курсора.
			})}
			rowBackgroundColor={(record) => (onRowClick === 'singleSelection' || multiSelection ? getRowBgColor(record.id) : 'white')}
			// Multi selection
			// Это место заставило передавать весь item в таблицу, чтобы можно было использовать функции встроенную в библиотеку.
			selectedRecords={multiSelection ? selectedItems : undefined}
			onSelectedRecordsChange={(selectedItems) => {
				store.setSelectedItems(selectedItems);
				// Установим состояние выбора для всей иерархии, если есть TableScope.
				// Здесь мы устанавливаем TableScope, а useSelectedItems в TableController использует TableScope.
				const scopeDbClass = store.tableProps.scope?.get((s) => s?.dbClass);
				if (scopeDbClass) store.scope.get()?.setMultiSelection(store.tableId.get(), scopeDbClass, selectedItems);
			}}
			// Expansion
			//@ts-ignore Не разобрался с типизацией
			rowExpansion={
				expansion.enabled
					? {
							allowMultiple: expansion.allowMultiple,
							// Мы сами управляем событием клика, т.к. накладываем на него фильтрацию.
							// См. onRowClickHandler, ExpanderCell и getCursorState.
							trigger: 'never',
							collapseProps: expansion.collapseProps,
							expanded: {
								recordIds: expandedIds, // Развернутые строки.
								//onRecordIdsChange: () => {}//(expandedIds: string[]) => store.expandedIds.set(expandedIds),
							},
							content: ({ record, collapse }) => {
								// Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную
								Noodl.Objects[record.id].collapse = collapse;
								return <ExpansionRow itemId={record.id} />;
							},
					  }
					: undefined
			}
			// Sort
			sortStatus={sortState}
			onSortStatusChange={(state) => store.sortState.set(state)}
			{...libProps}
		/>
	);
});

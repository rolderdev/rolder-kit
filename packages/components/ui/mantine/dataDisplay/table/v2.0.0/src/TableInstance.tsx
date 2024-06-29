/* Сама таблица */

import { memo, useEffect } from 'react';
import { DataTable } from 'mantine-datatable';
import { sendOutput, sendSignal } from '@packages/port-send';
import type { Item } from 'types';
import { useStore } from './store';
import AccessorCell from './renders/AccessorCell';
import GetValueCell from './renders/GetValueCell';
import TemplateCell from './renders/TemplateCell';
import ExpanderCell from './renders/ExpanderCell';
import ExpansionRow from './renders/ExpansionRow';
import getRowBgColor from './funcs/getRowBgColor';
import { setSelectedItems } from './models/multiSelectionModel';

import rowClasses from './styles/row.module.css';

// memo остановит любой рендер пришедший сверху, кроме изменения fetching.
export default memo((p: { fetching: boolean }) => {
	const store = useStore();
	if (!store) return;

	// Берем состояние по частям для точечной реактивности.
	const libProps = store.libProps.use();
	const columns = store.columns.use();
	const items = store.items.use();
	const onRowClick = store.tableProps.onRowClick.use();

	const selection = store.tableProps.selection.use();
	const selectedItems = store.selectedItems.use();

	const expansion = store.tableProps.expansion.use();
	const expandedIds = store.expandedIds.use();
	/* 	
	const selection = useStore(store, (s) => s.tableProps.selection);	
	 */
	//
	//const sortState = useStore(store, (s) => s.sort?.state);

	// Debugger
	/* useEffect(() => {
		const unsubLibProps = store.libProps.onChange((newVal, oldVal) =>
			console.log('libProps', store.tableId.get(), { oldVal, newVal })
		);
		const unsubColumns = store.columns.onChange((newVal, oldVal) =>
			console.log('columns', store.tableId.get(), { oldVal, newVal })
		);
		const unsubItems = store.items.onChange((newVal, oldVal) => console.log('items', store.tableId.get(), { oldVal, newVal }));
		const unsubOnRowClick = store.tableProps.onRowClick.onChange((newVal, oldVal) =>
			console.log('onRowClick', store.tableId.get(), { oldVal, newVal })
		);
		const unsubSelection = store.tableProps.selection.onChange((newVal, oldVal) =>
			console.log('selection', store.tableId.get(), { oldVal, newVal })
		);
		const unsubSelectedItems = store.selectedItems.onChange((newVal, oldVal) =>
			console.log('selectedItems', store.tableId.get(), { oldVal, newVal })
		);
		const unsubExpansion = store.tableProps.expansion.onChange((newVal, oldVal) =>
			console.log('expansion', store.tableId.get(), { oldVal, newVal })
		);
		const unsubExpandedIds = store.expandedIds.onChange((newVal, oldVal) =>
			console.log('expandedIds', store.tableId.get(), { oldVal, newVal })
		);
		return () => {
			unsubLibProps();
			unsubColumns();
			unsubItems();
			unsubOnRowClick();
			unsubSelection();
			unsubSelectedItems();
			unsubExpansion();
			unsubExpandedIds();
		};
	}, []); */

	//console.log('Table render', store.tableId.get()); // Считаем рендеры пока разрабатываем
	return (
		<DataTable<Item>
			// Base
			fetching={p.fetching}
			columns={columns.map((column) => ({
				// Передадим в колонку только параметры библиотеки, которые задает разработчик и accessor.
				...column.libColumn,
				accessor: column.accessor,
				// Подставляем свою ячейку. В ячейку нужно подавать только id, чтобы управлять точечной реактивностью в ячейке.
				render: (item) => {
					if (expansion.enabled && column.expander) {
						if (column.type === 'accessor' && column.accessor)
							return <ExpanderCell itemId={item.id} cell={<AccessorCell itemId={item.id} accessor={column.accessor} />} />;
						if (column.type === 'getValue' && column.getValue)
							return <ExpanderCell itemId={item.id} cell={<GetValueCell itemId={item.id} columnIdx={column.idx} />} />;
						if (column.type === 'template' && column.template)
							return <ExpanderCell itemId={item.id} cell={<TemplateCell itemId={item.id} columnIdx={column.idx} />} />;
					} else {
						if (column.type === 'accessor' && column.accessor)
							return <AccessorCell itemId={item.id} accessor={column.accessor} />;
						if (column.type === 'getValue' && column.getValue) return <GetValueCell itemId={item.id} columnIdx={column.idx} />;
						if (column.type === 'template' && column.template) return <TemplateCell itemId={item.id} columnIdx={column.idx} />;
					}
					return 'No Cell type';
				},
			}))}
			// Тригерим только на смену id. Остальное решает ячейка.
			records={items}
			onRowClick={
				onRowClick === 'disabled'
					? undefined
					: ({ record }) => {
							if (onRowClick === 'signal') {
								sendOutput(
									store.noodlNode.get(),
									'clickedItem',
									items.find((i) => i.id === record.id)
								);
								sendSignal(store.noodlNode.get(), 'rowClicked');
							}
							// Single selection
							//if (onRowClick === 'singleSelection') setSelectedRowId(store, rowIds, record.id);
					  }
			}
			// Row styles
			// Не смог разобраться почему rowBackgroundColor не достаточно для установки стилей мульти-выбора.
			rowClassName={rowClasses['mantine-datatable-row']} // Сброс встроенных стилей выделенной строки.
			rowStyle={() => ({ ['--mantine-primary-color-light']: 'transparent' })} // Сброс встроенных стилей включенного чекбокса.
			rowBackgroundColor={(record) => (selection.single.enabled || selection.multi ? getRowBgColor(record.id) : 'white')}
			// Multi selection
			// Это место заставило передавать весь item в таблицу, чтобы можно было использовать функции встроенную в библиотеку.
			selectedRecords={selection.multi ? selectedItems : undefined}
			onSelectedRecordsChange={(selectedItems) => setSelectedItems(store, selectedItems)}
			// Expansion
			//@ts-ignore Не разобрался с типизацией
			rowExpansion={
				expansion.enabled
					? {
							allowMultiple: expansion.allowMultiple,
							// Разворачивание по клику на строку, если включено
							trigger: onRowClick === 'expansion' ? 'click' : 'never',
							collapseProps: expansion.collapseProps,
							expanded: {
								recordIds: expandedIds, // Развернутые строки.
								onRecordIdsChange: (expandedIds: string[]) => store.expandedIds.set(expandedIds),
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
			/*sortStatus={sortState}
			onSortStatusChange={(state) => store.setState((s) => ({ sort: { ...s.sort, state } }))} */
			{...libProps}
		/>
	);
});

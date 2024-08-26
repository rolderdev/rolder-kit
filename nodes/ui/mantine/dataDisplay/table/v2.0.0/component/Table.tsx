import { memo, useContext } from 'react';
import { DataTable } from 'mantine-datatable';
import type { TableRecord } from './models/recordModel';
import { TableContext } from './TableProvider';
import { getColumns } from './models/columnModel';
import getRowClickHandler from './funcs/getRowClickHandler';
import getCursorState from './funcs/getCursorState';
import getRowBgColor from './funcs/getRowBgColor';
import { handleHierarchySelectionAndCheckboxProps, setSelectedIds } from './models/multiSelectionModel';
import ExpansionRow from './renders/ExpansionRow';

import rowClasses from './styles/row.module.css';

export default memo(() => {
	const { useSnapshot } = R.libs.valtio;

	const store = useContext(TableContext);
	const snap = useSnapshot(store);

	// Состояние чекбокса в хедере.
	//const headerCheckboxProps = useHeaderCheckboxProps(store);

	//console.log('Table', store.tableId);
	return (
		<DataTable<TableRecord>
			// Base
			fetching={snap.fetching}
			columns={getColumns(snap.columnsDefinition as any, snap.tableProps.expansion.enabled)}
			records={snap.fetching ? [] : snap.records}
			onRowClick={getRowClickHandler(store)}
			// Row styles
			className={
				// Убирает стандартный цвет мультивыбора.
				`${rowClasses['row']}` /* ${
					// Эти классы убирают лишние бордюры строк в развернутых таблицах.
					snap.tableProps.expansion.enabled
						? snap.libProps.withRowBorders
							? rowClasses['expansion-with-border']
							: rowClasses['expansion-without-border']
						: undefined
				} */
			}
			rowClassName={rowClasses['row']}
			rowStyle={(record) => ({ cursor: getCursorState(store, record.id) })} // Управление состоянием курсора.
			rowBackgroundColor={(record) => (snap.libProps.striped ? undefined : getRowBgColor(store, record.id))}
			getRecordSelectionCheckboxProps={(record, idx) => handleHierarchySelectionAndCheckboxProps(store, record, idx)}
			// Multi selection
			selectedRecords={store.tableProps.multiSelection.enabled ? snap.selectedIds.map((id) => ({ id })) : undefined}
			onSelectedRecordsChange={
				store.tableProps.multiSelection.enabled ? (selectedRecords) => setSelectedIds(store, selectedRecords) : undefined
			}
			// Заменим встроенную функцие запрета выбора своей, передав item.
			isRecordSelectable={(record) =>
				store.tableProps.multiSelection.enabled && snap.tableProps.multiSelection.filterFunc
					? snap.tableProps.multiSelection.filterFunc(R.items.get(record.id), record.id)
					: true
			}
			// Заменим стандартные параметры чекбокса в заголовке.
			// Нам это нужно из-за варианта, когда в корне нет ни отдного selected, но есть 'indeterminate'.
			//allRecordsSelectionCheckboxProps={headerCheckboxProps}
			// Уберем прилипание колоник с чекбоксом, если таблица часть иерархии.
			// Почему то этот код тригерит рендер, если прилетает с libprops.
			selectionColumnStyle={
				snap.tableProps.expansion.enabled || snap.isChild
					? { position: 'relative', '--mantine-datatable-shadow-background-left': 'none', borderLeft: 'unset' }
					: undefined
			}
			// Expansion
			rowExpansion={
				snap.tableProps.expansion.enabled
					? {
							allowMultiple: snap.tableProps.expansion.allowMultiple,
							// Мы сами управляем событием клика, т.к. накладываем на него фильтрацию.
							// См. onRowClickHandler, ExpanderCell и getCursorState.
							trigger: 'never',
							collapseProps: snap.tableProps.expansion.collapseProps,
							expanded: { recordIds: snap.expandedIds }, // Развернутые строки.
							content: ({ record, collapse }) => {
								// Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную
								Noodl.Objects[record.id].collapse = collapse;
								return <ExpansionRow id={record.id} />;
							},
					  }
					: undefined
			}
			{...(snap.libProps as any)}
		/>
	);
});

import { memo, useContext } from 'react';
import { DataTable } from 'mantine-datatable';
import type { TableRecord } from './models/recordModel';
import { TableContext } from './TableProvider';
import { getColumns } from './models/columnModel';
import getRowClickHandler from './funcs/getRowClickHandler';
import getCursorState from './funcs/getCursorState';
import getRowBgColor from './funcs/getRowBgColor';
import { handleRecordSelection, setSelectedIds, useHierarchySelection } from './models/multiSelectionModel';
import ExpansionRow from './renders/ExpansionRow';

import rowClasses from './styles/row.module.css';

export default memo(() => {
	const { get } = R.libs.just;
	const { useSnapshot } = R.libs.valtio;

	const store = useContext(TableContext);
	const snap = useSnapshot(store);

	// Состояние чекбоксов и реактивность на изменения выбора в иерархии.
	useHierarchySelection(store);

	//console.log('Table render', store.hierarchy.tableNodePath, store.hierarchy.level);
	return (
		<DataTable<TableRecord>
			// Base
			fetching={snap.fetching}
			columns={getColumns(snap.columnsDefinition as any, snap.tableProps.expansion.enabled)}
			records={snap.fetching ? [] : snap.records}
			onRowClick={getRowClickHandler(store)}
			// Row styles
			className={`${rowClasses['row']}`}
			rowStyle={(record) => ({ cursor: getCursorState(store, record.id) })} // Управление состоянием курсора.
			rowBackgroundColor={(record) => (snap.libProps.striped ? undefined : getRowBgColor(store, record.id))}
			getRecordSelectionCheckboxProps={(record) => get(snap.checkboxes, ['props', record.id])}
			// Multi selection
			selectedRecords={
				store.tableProps.multiSelection.enabled
					? Object.keys(snap.selectedIds)
							.filter((id) => snap.selectedIds[id])
							.map((id) => ({ id }))
					: undefined
			}
			onSelectedRecordsChange={
				store.tableProps.multiSelection.enabled ? (selectedRecords) => setSelectedIds(store, selectedRecords) : undefined
			}
			// Заменим встроенную функцию запрета выбора своей.
			isRecordSelectable={(record) =>
				store.tableProps.multiSelection.enabled ? handleRecordSelection(store, snap as any, record.id) : true
			}
			// Заменим стандартные параметры чекбокса в заголовке.
			// Нам это нужно из-за варианта, когда в корне нет ни отдного selected, но есть 'indeterminate'.
			allRecordsSelectionCheckboxProps={get(snap.checkboxes, ['props', 'header'])}
			// Уберем прилипание колоник с чекбоксом, если таблица часть иерархии.
			// Почему то этот код тригерит рендер, если прилетает с libprops.
			selectionColumnStyle={
				snap.tableProps.expansion.enabled || snap.hierarchy?.isChild
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
							// Развернутые строки.
							expanded: { recordIds: Object.keys(snap.expandedIds).filter((id) => snap.expandedIds[id]) },
							content: ({ record, collapse }) => {
								// Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную.
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

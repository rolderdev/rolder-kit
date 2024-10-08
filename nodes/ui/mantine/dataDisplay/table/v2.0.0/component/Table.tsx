import { memo, useContext } from 'react';
import { DataTable } from 'mantine-datatable';
import type { TableRecord } from './models/record';
import { TableContext } from './TableProvider';
import { getColumns } from './models/column';
import getRowClickHandler from './funcs/getRowClickHandler';
import getCursorState from './funcs/getCursorState';
import getRowBgColor from './funcs/getRowBgColor';
import { handleRecordSelection, setSelectedIds, useHierarchySelection } from './models/multiSelection';
import ExpansionRow from './renders/ExpansionRow';
import { setSortState } from './models/sort';

import rowClasses from './styles/row.module.css';

export default memo(() => {
	const { get } = R.libs.just;
	const { useSnapshot } = R.libs.valtio;

	const s = useContext(TableContext);
	const snap = useSnapshot(s);

	// Состояние чекбоксов и реактивность на изменения выбора в иерархии.
	useHierarchySelection(s);

	//console.log('Table render', snap.sortState);
	return (
		<DataTable<TableRecord>
			// Base
			style={() => ({ popover: { radius: 32 } })}
			fetching={snap.fetching}
			columns={getColumns(snap as any)}
			records={snap.fetching ? [] : snap.records}
			onRowClick={getRowClickHandler(s)}
			// Row styles
			className={rowClasses.row}
			rowStyle={(record) => ({ cursor: getCursorState(s, record.id), '&td': { borderBottom: '4px solid' } })} // Управление состоянием курсора.
			rowBackgroundColor={(record) => getRowBgColor(s, record.id)}
			getRecordSelectionCheckboxProps={(record) => get(snap.checkboxes, ['props', record.id])}
			// Multi selection
			selectedRecords={
				s.tableProps.multiSelection.enabled
					? Object.keys(snap.selectedIds)
							.filter((id) => snap.selectedIds[id])
							.map((id) => ({ id }))
					: undefined
			}
			onSelectedRecordsChange={
				s.tableProps.multiSelection.enabled ? (selectedRecords) => setSelectedIds(s, selectedRecords) : undefined
			}
			// Заменим встроенную функцию запрета выбора своей.
			isRecordSelectable={(record) =>
				s.tableProps.multiSelection.enabled ? handleRecordSelection(s, snap as any, record.id) : true
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
			// Sort
			sortStatus={snap.sortState}
			onSortStatusChange={(sortState) => setSortState(s, sortState)}
			{...(snap.libProps as any)}
		/>
	);
});

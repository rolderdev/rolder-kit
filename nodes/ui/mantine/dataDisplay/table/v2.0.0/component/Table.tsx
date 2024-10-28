import { DataTable } from 'mantine-datatable'
import { memo } from 'react'
import { isRecordSelectable, setSelectedIds } from './models/multiSelection'
import type { TableRecord } from './models/record'
import { getCursorState, getRowBgColor, getRowClickHandler } from './models/row'
import { setSortState } from './models/sort'
import ExpansionRow from './renders/ExpansionRow'
import { useStore } from './store'

import rowClasses from './styles/row.module.css'

export default memo((p: { tableId: string }) => {
	const s = useStore(p.tableId)
	const sn = R.libs.valtio.useSnapshot(s)

	//console.log('Table render', p.tableId, s.selectedId)
	return (
		<DataTable<TableRecord>
			// Base
			columns={Object.values(sn.columns as any)}
			fetching={sn.fetching}
			records={sn.fetching ? undefined : (sn.records as any)}
			// style={() => ({ popover: { radius: 32 } })}
			onRowClick={getRowClickHandler(s, sn.tableProps.onRowClick, sn.funcs.clickFilterFunc)}
			// Row styles
			className={rowClasses.row}
			// Управление состоянием курсора.
			rowStyle={(record) => ({
				cursor: getCursorState(
					s,
					record.id,
					sn.tableProps.onRowClick,
					sn.funcs.clickFilterFunc,
					sn.funcs.singleSelectionFilterFunc,
					sn.funcs.expansionFilterFunc
				),
				'&td': { borderBottom: '4px solid' },
			})}
			rowBackgroundColor={(record) => getRowBgColor(s, record.id, sn.selectedId, sn.selectedIds, sn.tableProps.rowStyles)}
			// Multi selection
			// Добавим настройки чекбокса поверх заданного разработчиком - отступ и indeterminate.
			getRecordSelectionCheckboxProps={(record) => R.libs.just.get(sn.rows, [record.id, 'checkBoxProps'])}
			selectedRecords={
				s.tableProps.multiSelection.enabled
					? Object.keys(sn.selectedIds)
							.filter((id) => sn.selectedIds[id])
							.map((id) => ({ id }))
					: undefined
			}
			onSelectedRecordsChange={
				s.tableProps.multiSelection.enabled ? (selectedRecords) => setSelectedIds(s, selectedRecords) : undefined
			}
			// Заменим встроенную функцию запрета выбора своей.
			isRecordSelectable={(record) =>
				s.tableProps.multiSelection.enabled ? isRecordSelectable(s, record.id, sn.funcs.multiSelectionFilterFunc) : true
			}
			// Уберем прилипание колоник с чекбоксом, если таблица часть иерархии.
			// Почему то этот код тригерит рендер, если прилетает с libprops.
			selectionColumnStyle={
				sn.tableProps.expansion.enabled || sn.hierarchy?.isChild
					? {
							position: 'relative',
							'--mantine-datatable-shadow-background-left': 'none',
							borderLeft: 'unset',
							// Для всех ячеек разделитель ставится в модели колонки, здесь для ячейки с чекбоксом.
							borderBottom:
								sn.libProps.withRowBorders &&
								(sn.tableProps.expansion.enabled || !sn.expandedIds[R.libs.just.last(sn.records.map((i) => i.id))]
									? 'calc(0.0625rem * var(--mantine-scale)) solid var(--mantine-datatable-row-border-color)'
									: undefined),
						}
					: undefined
			}
			// Sort
			sortStatus={sn.sort.state}
			onSortStatusChange={(sortState) => setSortState(s, sortState)}
			// Expansion
			rowExpansion={
				sn.tableProps.expansion.enabled
					? {
							allowMultiple: sn.tableProps.expansion.allowMultiple,
							// Мы сами управляем событием клика, т.к. накладываем на него фильтрацию.
							// См. onRowClickHandler, ExpanderCell и getCursorState.
							trigger: 'never',
							collapseProps: sn.tableProps.expansion.collapseProps,
							// Развернутые строки.
							expanded: { recordIds: sn.expandedIdsArr },
							content: ({ record, collapse }) => {
								// Добавляем функцию collapse прямо в объект, чтбы разработчик мог запустить ее и свернуть вручную.
								Noodl.Objects[record.id].collapse = collapse
								return <ExpansionRow tableId={p.tableId} id={record.id} />
							},
						}
					: undefined
			}
			{...(sn.libProps as any)}
		/>
	)
})

import { useContext } from 'react';
import { useStore } from 'zustand';
import { TableContext } from '../store/store';

export default function (rowId: string) {
	const store = useContext(TableContext);
	if (!store) return;

	const rowStyles = useStore(store, (s) => s.tableProps.rowStyles);
	const selectedRowId = useStore(store, (s) => s.selectedRowId);
	const selectedRowIds = useStore(store, (s) => s.selectedRowIds);

	let bgColor = rowStyles.rowBackgroundColor;
	if (selectedRowIds.includes(rowId)) bgColor = rowStyles.mutliSelectionRowBgColor;
	// Единичный выьор перекрывает мульти-выбор.
	if (selectedRowId === rowId) bgColor = rowStyles.singleSelectionRowBgColor;

	return bgColor;
}

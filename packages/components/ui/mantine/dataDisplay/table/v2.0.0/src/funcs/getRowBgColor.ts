import { useStore } from '../store';

export default function (rowId: string) {
	const store = useStore();
	if (!store) return;

	const rowStyles = store.tableProps.rowStyles.use();
	//const selectedRowId = useStore(store, (s) => s.selectedRowId);
	const selectedIds = store.selectedIds.use();

	let bgColor = rowStyles.rowBackgroundColor;
	if (selectedIds.includes(rowId)) bgColor = rowStyles.mutliSelectionRowBgColor;
	// Единичный выьор перекрывает мульти-выбор.
	//if (selectedRowId === rowId) bgColor = rowStyles.singleSelectionRowBgColor;

	return bgColor;
}

import type { Store } from '../../node/store';

export default function (s: Store, id: string) {
	const snap = R.libs.valtio.useSnapshot(s);

	const rowStyles = snap.tableProps.rowStyles;
	let bgColor = rowStyles.rowBackgroundColor;

	if (snap.selectedIds.includes(id)) bgColor = rowStyles.mutliSelectionRowBgColor;
	// Единичный выбор перекрывает мульти-выбор.
	if (snap.selectedId === id) bgColor = rowStyles.singleSelectionRowBgColor;

	return bgColor;
}
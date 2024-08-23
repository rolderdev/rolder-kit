import type { Store } from '../../node/store';

export default function (s: Store, itemId: string) {
	const snap = R.libs.valtio.useSnapshot(s);

	const rowStyles = snap.tableProps.rowStyles;
	let bgColor = rowStyles.rowBackgroundColor;

	if (snap.selectedRecords.map((i) => i.id).includes(itemId)) bgColor = rowStyles.mutliSelectionRowBgColor;
	// Единичный выбор перекрывает мульти-выбор.
	if (snap.selectedItem?.id === itemId) bgColor = rowStyles.singleSelectionRowBgColor;

	return bgColor;
}

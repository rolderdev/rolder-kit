import { useStore } from '../store/store';

export default function (itemId: string) {
	const s = useStore();
	if (!s) return;

	const rowStyles = s.cold.tableProps.rowStyles.use();
	const selectedItem = s.selectedItem.use();
	const selectedItems = s.cold.selectedItems.use();

	let bgColor = rowStyles.rowBackgroundColor;

	if (selectedItems.map((i) => i.id).includes(itemId)) bgColor = rowStyles.mutliSelectionRowBgColor;
	// Единичный выбор перекрывает мульти-выбор.
	if (selectedItem?.id === itemId) bgColor = rowStyles.singleSelectionRowBgColor;

	return bgColor;
}

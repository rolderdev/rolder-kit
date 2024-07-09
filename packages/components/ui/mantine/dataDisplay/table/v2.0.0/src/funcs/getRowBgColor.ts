import { useStore } from '../store';

export default function (itemId: string) {
	const store = useStore();
	if (!store) return;

	const rowStyles = store.tableProps.rowStyles.use();
	const selectedItem = store.selectedItem.use();
	const selectedItems = store.selectedItems.use();

	let bgColor = rowStyles.rowBackgroundColor;
	if (selectedItems.map((i) => i.id).includes(itemId)) bgColor = rowStyles.mutliSelectionRowBgColor;
	// Единичный выьор перекрывает мульти-выбор.
	if (selectedItem?.id === itemId) bgColor = rowStyles.singleSelectionRowBgColor;

	return bgColor;
}

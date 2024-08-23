/* Модель единичного выбора. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';

// Метод установки выбора. Фильтрует по items. Не срабатывает, если undefined. Раработчик должен использовать reset.
// Устанавливает новый выбор, если новый не совпадает со старым.
// Сбрасывает выбор, если новый совпадает со старым.
export const setSelectedItem = (s: Store, selectedItemId: string, isDefault?: boolean) => {
	const snapshot = R.libs.valtio.snapshot;
	const selectedItem = R.libs.just.get(s.items, selectedItemId);
	if (selectedItem) {
		const hierarchyNode = s.hierarchyNode?.find((i) => i.data.id === selectedItem.id);
		if (s.selectedItem?.id !== selectedItem.id) {
			const filterFunc = s.tableProps.singleSelectionFilterFunc;
			if (filterFunc && !filterFunc(snapshot(selectedItem), hierarchyNode)) return;
			s.selectedItem = selectedItem;
		} else s.selectedItem = null;
		sendOutput(s.noodlNode, 'selectedItem', s.selectedItem);
		if (hierarchyNode) sendOutput(s.noodlNode, 'selectedHierarchyNode', hierarchyNode);
		if (!isDefault) sendSignal(s.noodlNode, 'selectedItemChanged');
	}
};

// Метод сброса выбора. Проверяет есть ли что сбрасывать.
export const resetSelectedItem = (s: Store) => {
	if (s.selectedItem) {
		s.selectedItem = null;
		sendOutput(s.noodlNode, 'selectedItem', null);
		sendSignal(s.noodlNode, 'selectedItemChanged');
	}
};

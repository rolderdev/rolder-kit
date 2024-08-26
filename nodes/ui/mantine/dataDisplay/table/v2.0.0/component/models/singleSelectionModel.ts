/* Модель единичного выбора. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';

// Метод установки выбора. Фильтрует по items. Не срабатывает, если undefined. Раработчик должен использовать reset.
// Устанавливает новый выбор, если новый не совпадает со старым.
// Сбрасывает выбор, если новый совпадает со старым.
export const setSelectedId = (s: Store, selectedId: string, isDefault?: boolean) => {
	const snapshot = R.libs.valtio.snapshot;
	const selectedItem = R.items.get(selectedId);
	if (selectedItem) {
		if (s.selectedId !== selectedId) {
			const filterFunc = s.tableProps.singleSelectionFilterFunc;
			if (filterFunc && !filterFunc(snapshot(selectedItem))) return;
			s.selectedId = selectedId;
		} else s.selectedId = null;
		sendOutput(s.noodlNode, 'selectedItem', selectedItem);
		if (!isDefault) sendSignal(s.noodlNode, 'selectedItemChanged');
	}
};

// Метод сброса выбора. Проверяет есть ли что сбрасывать.
export const resetSelectedId = (s: Store) => {
	if (s.selectedId) {
		s.selectedId = null;
		sendOutput(s.noodlNode, 'selectedItem', null);
		sendSignal(s.noodlNode, 'selectedItemChanged');
	}
};

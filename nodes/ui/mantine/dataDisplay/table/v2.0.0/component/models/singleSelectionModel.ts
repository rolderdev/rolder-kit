/* Модель единичного выбора. */

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';
import useNode from '../funcs/useNode';
import useItem from '../funcs/useItem';

// Метод установки выбора. Фильтрует по items.
// Устанавливает новый выбор, если новый не совпадает со старым.
// Сбрасывает выбор, если новый совпадает со старым.
export const setSelectedId = (s: Store, selectedId: string, isDefault?: boolean) => {
	const selectedItem = useItem(selectedId, 'store');
	const selectedItemSnap = useItem(selectedId, 'snap');
	const nodeSnap = useNode(s, selectedId, 'snap');
	if (selectedItemSnap) {
		if (s.selectedId !== selectedId) {
			const filterFunc = s.tableProps.singleSelectionFilterFunc;
			if (filterFunc && !filterFunc(selectedItemSnap, nodeSnap)) return;
			s.selectedId = selectedId;
		} else s.selectedId = null;
		sendOutput(s.noodlNode, 'selectedItem', selectedItem);
		sendOutput(s.noodlNode, 'selectedNode', nodeSnap);
		if (!isDefault) sendSignal(s.noodlNode, 'selectedItemChanged');
	}
};

// Метод сброса выбора. Проверяет есть ли что сбрасывать.
export const resetSelectedId = (s: Store) => {
	if (s.selectedId) {
		s.selectedId = null;
		sendOutput(s.noodlNode, 'selectedItem', null);
		sendOutput(s.noodlNode, 'selectedNode', null);
		sendSignal(s.noodlNode, 'selectedItemChanged');
	}
};

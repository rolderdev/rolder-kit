/* Модель единичного выбора. */

import { sendOutput, sendSignal } from '@packages/port-send';
import type { Item } from 'types';
import type { Store } from '../store';

export const setSelectedItem = (store: Store, selectedItem: Item) => {
	if (store.selectedItem.get()?.id !== selectedItem.id) {
		const singleSelectionFilterFunc = store.tableProps.singleSelectionFilterFunc?.get();
		if (singleSelectionFilterFunc && !singleSelectionFilterFunc(selectedItem)) return;
		store.selectedItem.set(selectedItem);
	} else store.selectedItem.set(null);
};

export const sendSelectedItem = (store: Store, newSelectedItem: Item | null) => {
	sendOutput(store.noodlNode.get(), 'selectedItem', newSelectedItem);
	if (store.selectedItemFirstRun.get()) store.selectedItemFirstRun.set(false);
	else sendSignal(store.noodlNode.get(), 'selectedItemChanged');
};

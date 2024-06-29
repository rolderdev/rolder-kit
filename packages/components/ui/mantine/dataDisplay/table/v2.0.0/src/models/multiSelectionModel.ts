/* Модель мульти-выбора. */

import { sendOutput, sendSignal } from '@packages/port-send';
import type { Item } from 'types';
import type { Store } from '../store';
import isArrObjEquals from '../funcs/isArrayEqual';

// Метод обновляет состояние выбранных строк.
// Метод используется, как при выборе чекбоксами, так и при внешних изменениях, например, при смене самих items.
// Это позволяет покрыть такие сценарии, как удаление выбранных строк из items.
export const setSelectedItems = (store: Store, selectedItems: Item[]) => {
	// Отфильтруем, чтобы узнать есть ли у нас выбранные строки, которых уже нет.
	const newSelectedItems = store.items.get((items) => items.filter((i) => selectedItems.map((i) => i.id).includes(i.id)));
	if (!isArrObjEquals(store.selectedItems.get(), newSelectedItems)) {
		store.selectedItems.assign(newSelectedItems);
	}
};

// Метод сброса выбранных строк.
export const resetSelectedItems = (store: Store) => {
	if (store.selectedItems.get().length) store.selectedItems.set([]);
};

// Метод отправки выбранных строк.
export const sendSelectedItems = (store: Store, newSelectedItems: Item[]) => {
	sendOutput(store.noodlNode.get(), 'selectedItems', newSelectedItems);
	// Не отправляем сигнал, когда есть изначально выбранные строки.
	if (store.selectedItemsFirstRun.get()) store.selectedItemsFirstRun.set(false);
	else sendSignal(store.noodlNode.get(), 'selectedItemsChanged');
};

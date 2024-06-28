/* Функция устанавливает выходной порт для выбранных строк. */

import { sendOutput, sendSignal } from '@packages/port-send';
import type { Store } from '../store';

export default function (store: Store, newSelectedIds: string[]) {
	const newSelectedItems = store.items.get((items) => items.filter((i) => newSelectedIds.includes(i.id)));

	sendOutput(store.noodlNode.get(), 'selectedItems', newSelectedItems);
	// Так отлавливается первый рендер для исключения сигнала.
	if (store.selectedIdsFirstRun.get()) store.selectedIdsFirstRun.set(false);
	else sendSignal(store.noodlNode.get(), 'selectedItemsChanged');
}

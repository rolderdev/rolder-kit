/* Функция устанавливает выходной порт для выбранных строк. */

import { sendOutput, sendSignal } from '@packages/port-send';
import type { Store } from '../store/store';

export default function (store: Store, selectedRowIds: string[]) {
	const items = Array.from(store.getState().rows.values())
		.filter((i) => selectedRowIds.includes(i.id))
		.map((i) => i.item);

	sendOutput(store.getState().noodlNode, 'selectedItems', items);
	// Так отлавливается первый рендер для исключения сигнала.
	if (store.getState().selectedRowsFirstRun) store.setState({ selectedRowsFirstRun: false });
	else sendSignal(store.getState().noodlNode, 'selectedItemsChanged');
}

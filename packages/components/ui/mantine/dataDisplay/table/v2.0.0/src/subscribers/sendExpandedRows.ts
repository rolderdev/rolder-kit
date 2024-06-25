/* Функция устанавливает выходной порт для развернутых строк. */

import { sendOutput, sendSignal } from '@packages/port-send';
import type { Store } from '../store/store';

export default function (store: Store, expandedRowIds: string[]) {
	const items = Array.from(store.getState().rows.values())
		.filter((i) => expandedRowIds.includes(i.id))
		.map((i) => i.item);

	sendOutput(store.getState().noodlNode, 'expandedItems', items);
	// Так отлавливается первый рендер для исключения сигнала.
	if (store.getState().expandedRowsFirstRun) store.setState({ expandedRowsFirstRun: false });
	else sendSignal(store.getState().noodlNode, 'expandedItemsChanged');
}

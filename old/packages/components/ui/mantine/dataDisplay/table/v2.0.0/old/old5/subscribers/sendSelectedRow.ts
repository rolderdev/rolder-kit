/* Функция устанавливает выходной порт для выбранной строки. */

import { sendOutput, sendSignal } from '@packages/port-send';
import type { Store } from '../store/store';

export default function (store: Store, prevSelectedRowId?: string, selectedRowId?: string) {
	// Так отлавливается первый рендер для подачи значения в порт, но не трогать сигнал.
	if (store.getState().selectedRowFirstRun) {
		if (selectedRowId && store.getState().selectedRowFirstRun) {
			sendOutput(store.getState().noodlNode, 'selectedItem', store.getState().rows.get(selectedRowId)?.item);
			store.setState({ selectedRowFirstRun: false });
		}
	} else {
		if (selectedRowId !== prevSelectedRowId) {
			sendOutput(
				store.getState().noodlNode,
				'selectedItem',
				selectedRowId ? store.getState().rows.get(selectedRowId)?.item : null
			);
		}
		sendSignal(store.getState().noodlNode, 'selectedItemChanged');
	}
}

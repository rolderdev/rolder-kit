import { sendOutput, sendSignal } from '@packages/port-send';
import type { Store } from '../store/store';
import type { Item } from 'types';
import { setSelectedItem } from '../models/singleSelectionModel';
import { toggleRowExpansion } from '../models/expansionModel';

export default function (s: Store) {
	const onRowClick = s.hot.tableProps.onRowClick.get();
	if (onRowClick === 'disabled') return undefined;

	return ({ record }: { record: Item }) => {
		switch (onRowClick) {
			case 'signal': {
				const clickFilterFunc = s.hot.tableProps.clickFilterFunc?.get();
				// Если разработчик добавил проверку и она false, отменяем отправку.
				if (clickFilterFunc && !clickFilterFunc(record)) return;
				sendOutput(s.noodlNode.get(), 'clickedItem', record);
				sendSignal(s.noodlNode.get(), 'rowClicked');
				return;
			}
			case 'function': {
				// Для функции разработчик может применить функцию фильтрации, чтобы не показывать курсор-руку и не вызывать clickFunc.
				const clickFilterFunc = s.hot.tableProps.clickFilterFunc?.get();
				if (clickFilterFunc && !clickFilterFunc(record)) return;
				const clickFunc = s.hot.tableProps.clickFunc?.get();
				// Запустим функцию по клику. Предполагается, что разработчик сам обустроит ее сигналом и передачей кликнутого item.
				if (clickFunc) {
					const hierarchyNode = s.get((s) => s.scopeStore?.get()?.hierarchy?.find((i) => i.data.fid === record.fid));
					clickFunc(record, s.cold.items.get() || [], hierarchyNode);
				}
				return;
			}
			case 'singleSelection': {
				setSelectedItem(s, record);
				return;
			}
			case 'expansion': {
				toggleRowExpansion(s, record);
				return;
			}
		}
	};
}

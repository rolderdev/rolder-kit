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
			case 'singleSelection': {
				setSelectedItem(s, record);
				return;
			}
			case 'expansion': {
				toggleRowExpansion(s, record);
				return;
			}
			default:
				return 'unset';
		}
	};
}

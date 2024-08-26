import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';
import type { TableRecord } from '../models/recordModel';
import { setSelectedId } from '../models/singleSelectionModel';
import { toggleRowExpansion } from '../models/expansionModel';

export default function (s: Store) {
	const onRowClick = s.tableProps.onRowClick;

	if (onRowClick === 'disabled') return undefined;

	return ({ record }: { record: TableRecord }) => {
		const item = R.items.get(record.id);
		if (item)
			switch (onRowClick) {
				case 'signal': {
					const clickFilterFunc = s.tableProps.clickFilterFunc;
					// Если разработчик добавил проверку и она false, отменяем отправку.
					if (clickFilterFunc && !clickFilterFunc(R.libs.valtio.snapshot(item))) return;
					sendOutput(s.noodlNode, 'clickedItem', item);
					sendSignal(s.noodlNode, 'rowClicked');
					return;
				}

				case 'singleSelection': {
					setSelectedId(s, record.id);
					return;
				}
				case 'expansion': {
					toggleRowExpansion(s, record.id);
					return;
				}
			}
	};
}

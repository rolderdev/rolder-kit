import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../store';
import type { TableRecord } from '../models/record';
import { setSelectedId } from '../models/singleSelection';
import { toggleRowExpansion } from '../models/expansion';
import useItem from './useItem';
import useNode from './useNode';

export default function (s: Store) {
	const onRowClick = s.tableProps.onRowClick;

	if (onRowClick === 'disabled') return undefined;

	return ({ record }: { record: TableRecord }) => {
		const item = useItem(record.id, 'store');
		const nodeSnap = useNode(s, record.id, 'snap');
		if (item)
			switch (onRowClick) {
				case 'signal': {
					const clickFilterFunc = s.tableProps.clickFilterFunc;
					// Если разработчик добавил проверку и она false, отменяем отправку.
					if (clickFilterFunc && !clickFilterFunc(item, nodeSnap)) return;
					sendOutput(s.noodlNode, 'clickedItem', item);
					sendOutput(s.noodlNode, 'clickedNode', nodeSnap);
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

import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Store } from '../../node/store';
import type { TableRecord } from '../models/itemModel';
import { setSelectedItem } from '../models/singleSelectionModel';
import { toggleRowExpansion } from '../models/expansionModel';

export default function (s: Store) {
	const onRowClick = s.tableProps.onRowClick;

	if (onRowClick === 'disabled') return undefined;

	return ({ record }: { record: TableRecord }) => {
		const item = R.libs.just.get(s.items, record.id);
		switch (onRowClick) {
			case 'signal': {
				const clickFilterFunc = s.tableProps.clickFilterFunc;
				const hierarchyNode = s.hierarchyNode?.find((i) => i.data.id === item.id);
				// Если разработчик добавил проверку и она false, отменяем отправку.
				if (clickFilterFunc && !clickFilterFunc(R.libs.valtio.snapshot(item), hierarchyNode)) return;
				sendOutput(s.noodlNode, 'clickedItem', item);
				if (hierarchyNode) sendOutput(s.noodlNode, 'clickedHierarchyNode', hierarchyNode);
				sendSignal(s.noodlNode, 'rowClicked');
				return;
			}

			case 'singleSelection': {
				setSelectedItem(s, record.id);
				return;
			}
			case 'expansion': {
				toggleRowExpansion(s, record.id);
				return;
			}
		}
	};
}

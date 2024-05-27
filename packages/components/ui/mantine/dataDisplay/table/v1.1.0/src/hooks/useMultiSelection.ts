import { useEffect, useState } from 'react';
import { sendOutput, sendSignal } from '@packages/port-send';
import type { NoodlNode } from '@packages/node';
import type { TableProps } from '../../types';
import type { Item } from 'types';
import { deepMap } from 'nanostores';

const selectedRecordsAtom = deepMap<{ [tableId: string]: Item[] | undefined }>();

export default function (noodlNode: NoodlNode, tableId: string, multiSelection: TableProps['selection']['multi'], items: Item[]) {
	const [selectedRecords, setSelectedRecordsState] = useState<Item[]>([]);

	function setSelectedRecords(tableId: string, selectedItems: Item[]) {
		const filteredSelectedItems = selectedItems.filter((i) => items.map((i) => i.id).includes(i.id));
		selectedRecordsAtom.setKey(tableId, filteredSelectedItems);
		if (filteredSelectedItems) {
			if (filteredSelectedItems.length) {
				setSelectedRecordsState(filteredSelectedItems);
				sendOutput(noodlNode, 'table2MultiSelectedItems', filteredSelectedItems);
			} else if (filteredSelectedItems.length === 0) {
				sendOutput(noodlNode, 'table2MultiSelectedItems', []);
				setSelectedRecordsState([]);
			}
			sendSignal(noodlNode, 'table2MultiSelectionChanged');
		}
	}

	useEffect(() => {
		if (multiSelection.selectedItems) setSelectedRecords(tableId, multiSelection.selectedItems);
	}, [multiSelection.selectedItems]);

	return { selectedRecords: selectedRecords || [], setSelectedRecords };
}

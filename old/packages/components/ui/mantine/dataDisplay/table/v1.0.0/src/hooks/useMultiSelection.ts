import { useEffect, useState } from 'react';
import { sendOutput, sendSignal } from '@packages/port-send';
import type { NoodlNode } from '@packages/node';
import type { TableProps } from '../../types';
import type { Item } from 'types';

export default function (noodlNode: NoodlNode, multiSelection: TableProps['selection']['multi']) {
	const [selectedRecords, setSelectedRecords] = useState<Item[] | undefined>();

	useEffect(() => {
		if (multiSelection.selectedItems) setSelectedRecords(multiSelection.selectedItems);
	}, [multiSelection.selectedItems]);
	useEffect(() => {
		if (selectedRecords) {
			if (selectedRecords.length) sendOutput(noodlNode, 'table2MultiSelectedItems', selectedRecords);
			else if (selectedRecords.length === 0) sendOutput(noodlNode, 'table2MultiSelectedItems', []);
			setTimeout(() => sendSignal(noodlNode, 'table2MultiSelectionChanged'));
		}
	}, [selectedRecords]);

	return { selectedRecords: selectedRecords || [], setSelectedRecords };
}

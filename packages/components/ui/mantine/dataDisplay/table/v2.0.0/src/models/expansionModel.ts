/* Модель расширяемых строк. */

import { sendOutput, sendSignal } from '@packages/port-send';
import type { Item } from 'types';
import type { Store } from '../store';
import getExpansionRow from '../funcs/getExpansionRow';

// Метод создает расширяемые строки для всех items, у которых их еще нет.
export const setExpansionRows = (store: Store) => {
	if (store.tableProps.expansion.enabled.get()) {
		Promise.all(
			store.items.get().map(async (item) => {
				if (!store.expansionRows[item.id].get()) {
					store.expansionRows[item.id].set(await getExpansionRow(store, item.id));
				}
			})
		);
	}
};

export const setExpanedIds = (store: Store, item: Item) => {
	const filterFunc = store.tableProps.expansion.filterFunc?.get();
	if (filterFunc && !filterFunc(item)) return;

	store.set((s) => {
		if (s.tableProps.expansion.allowMultiple) {
			if (s.expandedIds.includes(item.id)) s.expandedIds = s.expandedIds.filter((i) => i !== item.id);
			else s.expandedIds.push(item.id);
		} else {
			if (s.expandedIds.includes(item.id)) s.expandedIds = [];
			else s.expandedIds = [item.id];
		}
	});

	const noodlNode = store.noodlNode.get();
	const items = store.items.get();
	const expandedIds = store.expandedIds.get();
	sendOutput(
		noodlNode,
		'expandedItems',
		items.filter((i) => expandedIds.includes(i.id))
	);
	sendSignal(noodlNode, 'expandedItemsChanged');
};

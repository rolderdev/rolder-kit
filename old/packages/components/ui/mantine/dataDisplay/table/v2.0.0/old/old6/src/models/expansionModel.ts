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

// Метод установки состояние развернутых строк с проверкой функцией разработчика, если она есть.
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
};

// Метод отправки в порт состояния развернутых строк.
export const sendExpandedItems = (store: Store, expandedIds: string[]) => {
	const items = store.items.get();
	sendOutput(
		store.noodlNode.get(),
		'expandedItems',
		items.filter((i) => expandedIds.includes(i.id))
	);
	// Не отправляем сигнал, когда есть изначально развернутые строки.
	if (store.expandedIdsFirstRun.get()) store.expandedIdsFirstRun.set(false);
	else sendSignal(store.noodlNode.get(), 'expandedItemsChanged');
};

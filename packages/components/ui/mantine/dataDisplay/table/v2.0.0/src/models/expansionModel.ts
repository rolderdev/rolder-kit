/* Модель расширяемых строк. */

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

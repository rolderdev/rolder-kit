/* Модель item. */
import type { Item } from '@shared/types-v0.1.0';
import type { Props } from '../../types';

export type TableRecord = { id: string };
export type Items = Record<string, Item>;

export const setRecordIds = (p: Props) => {
	//const { get, set, map, compare } = R.libs.just;

	if (p.items) {
		/* // Добавление
		p.items.map((item) => {
			if (!compare(get(p.store.items, item.id), item)) {
				console.log('table changes');
				set(p.store.items, item.id, item);
			}
		});

		// Удаление
		map(p.store.items, (itemId) => {
			if (!p.items?.map((i) => i.id).includes(itemId)) delete p.store.items[itemId];
		});
 */
		p.store.records = p.items.map((i) => ({ id: i.id }));
	} else {
		p.store.records = [];
		//p.store.items = {};
	}
};

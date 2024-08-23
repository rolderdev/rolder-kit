import type { Item } from 'types';

export default (toFilterItems: Item[], items: Item[]) => {
	return toFilterItems.filter((i) => items.map((i) => i.id).includes(i.id));
};

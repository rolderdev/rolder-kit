import type { Item } from '@shared/types-v0.1.0';
import { merge } from '@shared/item-v0.1.0';
import getIem from './getIem';

export default (rawItem: Item, rootId: string) => {
	const proxyItem = R.items[rawItem.id];

	if (proxyItem) merge({ object: rawItem, proxyObject: proxyItem });
	// Добавим методы и встроенные параметры.
	else R.items[rawItem.id] = getIem(rawItem, rootId);
};

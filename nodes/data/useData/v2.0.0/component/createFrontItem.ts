import type { FrontItem, Item } from '@shared/types-v0.1.0';
import type { FrontItems } from '../node/store';

export default (frontItems: FrontItems, backItem: Item) => {
	const { proxy, snapshot } = R.libs.valtio;
	let proxyItem = proxy({ ...backItem, kid: backItem.id, id: R.libs.nanoid(10) }) as FrontItem;
	proxyItem.snap = () => R.libs.just.omit(snapshot(proxyItem), ['snap']);
	frontItems.set(backItem.id, proxyItem);
};

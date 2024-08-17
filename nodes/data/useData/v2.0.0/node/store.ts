import { Props, Store } from '../types';
import { proxy } from 'valtio';
import { proxyMap } from 'valtio/utils';

export default (p: Props) => {
	return proxy<Store>({
		useDataId: R.libs.nanoid(8),
		inited: false,
		apiVersion: p.apiVersion,
		fetchScheme: p.fetchScheme,
		controlled: p.controlled,
		subscribe: p.subscribe,
		schemes: proxyMap(),
		items: proxyMap(),
		hierarchy: {} as any,
		subscribes: proxyMap(),
	});
};
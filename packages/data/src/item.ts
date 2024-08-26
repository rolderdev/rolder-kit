import { jsNode } from '@shared/node-v1.0.0';

export default jsNode('item', {
	'v0.1.0': (await import('@nodes/item-v0.1.0')).default,
});

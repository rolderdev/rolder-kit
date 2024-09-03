import { jsNode } from '@shared/node-v1.0.0';

export default jsNode('node', {
	'v0.1.0': (await import('@nodes/node-v0.1.0')).default,
});

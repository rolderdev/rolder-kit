import { jsNode } from '@shared/node-v1.0.0';

export default jsNode(
	'search',
	{
		'v0.1.0': (await import('@nodes/search-v0.1.0')).default,
	},
	{ color: 'purple' }
);

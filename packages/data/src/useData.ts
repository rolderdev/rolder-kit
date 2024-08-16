import { jsNode } from '@shared/node-v1.0.0';

export default jsNode(
	'useData',
	{
		'v2.0.0': (await import('@nodes/use-data-v2.0.0')).default,
	},
	{ docs: 'https://docs.rolder.app/#/useData' }
);

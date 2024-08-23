import { reactNode } from '@shared/node-v1.0.0';

export default reactNode(
	'Table',
	{
		'v2.0.0': (await import('@nodes/table-v2.0.0')).default,
	},
	{ docs: '' }
);

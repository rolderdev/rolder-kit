import { reactNode } from '@shared/node-v1.0.0';

export default reactNode(
	'Data',
	{
		'v2.0.0': (await import('@nodes/data-v2.0.0')).default,
	},
	{ allowChildren: true, docs: '' }
);

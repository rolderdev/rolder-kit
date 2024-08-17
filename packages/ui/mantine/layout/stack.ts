import { reactNode } from '@shared/node-v1.0.0';

export default reactNode(
	'Stack',
	{
		'v2.0.0': (await import('@nodes/stack-v2.0.0')).default,
	},
	{ allowChildren: true, docs: '' }
);

import { reactNode } from '@shared/node-v1.0.0';

export default reactNode(
	'Tooltip',
	{
		'v0.1.0': (await import('@nodes/tooltip-v0.1.0')).default,
	},
	{ allowChildren: true, docs: '' }
);

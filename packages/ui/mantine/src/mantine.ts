import { reactNode } from '@shared/node-v1.0.0';

export default reactNode(
	'Mantine',
	{
		'v2.0.0': (await import('@nodes/mantine-v2.0.0')).default,
	},
	{ allowChildren: true, docs: '' }
);

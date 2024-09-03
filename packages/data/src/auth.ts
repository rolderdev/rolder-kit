import { reactNode } from '@shared/node-v1.0.0';

export default reactNode(
	'Auth',
	{
		'v2.0.0': (await import('@nodes/auth-v2.0.0')).default,
	},
	{ allowChildren: true, docs: '' }
);

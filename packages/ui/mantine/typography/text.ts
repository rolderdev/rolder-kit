import { jsNode } from '@shared/node-v1.0.0';

export default jsNode(
	'Text',
	{
		'v2.0.0': (await import('@nodes/text-v2.0.0')).default,
	},
	{ docs: '' }
);

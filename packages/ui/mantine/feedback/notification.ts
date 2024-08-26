import { jsNode } from '@shared/node-v1.0.0';

export default jsNode(
	'notification',
	{
		'v2.0.0': (await import('@nodes/notification-v2.0.0')).default,
	},
	{ color: 'purple' }
);

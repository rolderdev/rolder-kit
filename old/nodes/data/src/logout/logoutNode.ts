import { jsNode } from '@packages/node';
import { getPort } from '@packages/port';

export default jsNode(
	'logout',
	{
		'v1.0.0': {
			module: {
				dynamic: import('@packages/logout-v1.0.0'),
			},
			inputs: [getPort({ plug: 'input', name: 'logout', displayName: 'Logout', group: 'Signals', type: 'signal' })],
		},
		'v1.1.0': {
			module: {
				dynamic: import('@packages/logout-v1.1.0'),
			},
			inputs: [getPort({ plug: 'input', name: 'logout', displayName: 'Logout', group: 'Signals', type: 'signal' })],
		},
	},
	{ color: 'purple' }
);

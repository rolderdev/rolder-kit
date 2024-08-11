import { reactNode } from '@packages/node';

import v100 from '@packages/hover-card-target-v1.0.0';

export default reactNode(
	'HoverCardTarget',
	{
		'v1.0.0': {
			module: { static: v100 }
		}
	},
	{ allowChildren: true }
);

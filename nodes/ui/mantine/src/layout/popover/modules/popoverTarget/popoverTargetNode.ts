import { reactNode } from '@packages/node';

import v100 from '@packages/popover-target-v1.0.0';

export default reactNode(
	'PopoverTarget',
	{
		'v1.0.0': {
			module: { static: v100 }
		}
	},
	{ allowChildren: true }
);

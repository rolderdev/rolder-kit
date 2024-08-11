import { reactNode } from '@packages/node';
import { getPorts } from '@packages/port';

import v100 from '@packages/center-v1.0.0';

export default reactNode(
	'Center',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: getPorts('input', ['customProps', 'opacity', 'inline'])
		}
	},
	{ allowChildren: true }
);

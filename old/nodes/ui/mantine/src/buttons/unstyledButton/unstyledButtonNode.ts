import { reactNode } from '@packages/node';
import { getPorts } from '@packages/port';

import v100 from '@packages/unstyled-button-v1.0.0';

export default reactNode(
	'UnstyledButton',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: getPorts('input', ['customProps']),
			outputs: getPorts('output', ['clicked'])
		}
	},
	{ allowChildren: true }
);

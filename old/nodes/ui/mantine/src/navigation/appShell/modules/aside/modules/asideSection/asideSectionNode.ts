import { reactNode } from '@packages/node';
import { getPorts, inputGroups } from '@packages/port';

import v100 from '@packages/aside-section-v1.0.0';

export default reactNode(
	'AsideSection',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [...getPorts('input', ['customProps', 'propsFunction', 'grow']), ...inputGroups.Paddings, ...inputGroups.Margins]
		}
	},
	{ allowChildren: true }
);

import { reactNode } from '@packages/node';
import { getCustomEnumType, getPort, getPorts } from '@packages/port';

import v100 from '@packages/avatar-v1.0.0';

export default reactNode(
	'Avatar',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'size', 'radius', 'color']),
				getPort({
					plug: 'input',
					name: 'avatarVariant',
					displayName: 'Variant',
					group: 'Style',
					default: 'light',
					type: getCustomEnumType(['light', 'filled', 'outline', 'gradient'])
				})
			]
		}
	},
	{ allowChildren: true }
);

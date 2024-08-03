import { reactNode } from '@packages/node';
import { enums, getEnumType, getPort, getPorts, inputGroups } from '@packages/port';

import v100 from '@packages/paper-v1.0.0';
import v200 from '@packages/paper-v2.0.0';

export default reactNode(
	'Paper',
	{
		'v1.0.0': {
			hashTag: '#deprecated',
			module: { static: v100 },
			inputs: [
				...inputGroups.Margins,
				...inputGroups.Paddings,
				...getPorts('input', ['customProps', 'opacity', 'shadow', 'radius', 'withBorder']),
			],
		},
		'v2.0.0': {
			module: { static: v200 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'shadow',
					group: 'Style',
					type: getEnumType([{ value: 'none', label: 'none' }, ...enums.sizes]),
					displayName: 'Shadow',
					default: 'sm',
				}),
				...getPorts('input', ['customProps', 'opacity', 'radius', 'withBorder']),
				...inputGroups.Margins,
				...inputGroups.Paddings,
			],
		},
	},
	{ allowChildren: true }
);

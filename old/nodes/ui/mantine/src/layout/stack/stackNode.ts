import { reactNode } from '@packages/node';
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@packages/port';

const aligns = ['stretch', 'center', 'flex-start', 'flex-end'];
const justifies = ['center', 'flex-start', 'flex-end', 'space-between', 'space-around'];

import v100 from '@packages/stack-v1.0.0';

export default reactNode(
	'Stack',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...inputGroups.Margins,
				...inputGroups.Paddings,
				getPort({
					plug: 'input',
					name: 'stackAlign',
					displayName: 'Align',
					group: 'Layout',
					default: 'stretch',
					type: getCustomEnumType(aligns),
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'stackJustify',
					displayName: 'Justify',
					group: 'Layout',
					default: 'center',
					type: getCustomEnumType(justifies),
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'stackSpacing',
					displayName: 'Spacing',
					group: 'Layout',
					default: 'md',
					type: getEnumType(enums.sizes),
					customs: { required: 'both' },
				}),
				...getPorts('input', ['customProps', 'w', 'h', 'opacity']),
			],
		},
	},
	{ allowChildren: true }
);

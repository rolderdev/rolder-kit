import { reactNode } from '@packages/node';
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@packages/port';

const aligns = ['stretch', 'center', 'flex-start', 'flex-end'];
const justifies = ['center', 'flex-start', 'flex-end', 'space-between', 'space-around'];

import v100 from '@packages/stack-v1.0.0';
import v200 from '@packages/stack-v2.0.0';

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
		'v2.0.0': {
			module: { static: v200 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'w',
					displayName: 'Width',
					group: 'Dimensions',
					type: 'string',
				}),
				getPort({
					plug: 'input',
					name: 'h',
					displayName: 'Height',
					group: 'Dimensions',
					type: 'string',
				}),
				getPort({
					plug: 'input',
					name: 'align',
					displayName: 'Align',
					group: 'Layout',
					default: 'stretch',
					type: getCustomEnumType(aligns),
				}),
				getPort({
					plug: 'input',
					name: 'justify',
					displayName: 'Justify',
					group: 'Layout',
					default: 'flex-start',
					type: getCustomEnumType(justifies),
				}),
				getPort({
					plug: 'input',
					name: 'gap',
					displayName: 'Gap',
					group: 'Layout',
					default: 'md',
					type: getEnumType([{ value: '0', label: 'none' }, ...enums.sizes]),
				}),
				...inputGroups.Margins,
				...inputGroups.Paddings,
				...getPorts('input', ['customProps', 'opacity']),
			],
		},
	},
	{ allowChildren: true }
);

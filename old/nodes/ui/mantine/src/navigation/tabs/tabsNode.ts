import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/tabs-v1.0.0'

export default reactNode(
	'Tabs',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'propsFunction', 'value', 'radius', 'color', 'grow', 'h', 'w']),
				...inputGroups.Margins,
				...inputGroups.Paddings,
				getPort({
					plug: 'input',
					name: 'tabsVariant',
					displayName: 'Variant',
					group: 'Style',
					type: getCustomEnumType(['default', 'outline', 'pills']),
					default: 'default',
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'unstyled',
					displayName: 'Unstyled',
					group: 'Style',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'tabsPosition',
					displayName: 'Position',
					group: 'Layout',
					type: getCustomEnumType(['left', 'right', 'center', 'apart']),
					default: 'left',
				}),
				getPort({
					plug: 'input',
					name: 'tabsOrientation',
					displayName: 'Orientation',
					group: 'Layout',
					type: getCustomEnumType(['horizontal', 'vertical']),
					default: 'horizontal',
				}),
			],
		},
	},
	{ allowChildren: true }
)

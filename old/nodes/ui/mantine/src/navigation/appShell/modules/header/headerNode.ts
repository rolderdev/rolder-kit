import { reactNode } from '@packages/node'
import { enums, getEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/header-v1.0.0'

export default reactNode(
	'Header',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'propsFunction', 'opacity']),
				...inputGroups.Paddings,
				getPort({
					plug: 'input',
					name: 'headerWithBorder',
					displayName: 'With border',
					group: 'Style',
					type: 'boolean',
					default: true,
				}),
				getPort({
					plug: 'input',
					name: 'headerHeight',
					displayName: 'Height (responsive)',
					group: 'Dimensions',
					type: 'array',
					customs: {
						required: 'connection',
						isObject: true,
					},
				}),
				getPort({
					plug: 'input',
					name: 'burgerSize',
					displayName: 'Burger size',
					group: 'Dimensions',
					type: getEnumType(enums.sizes, 'editor'),
					default: 'sm',
				}),
			],
		},
	},
	{ allowChildren: true }
)

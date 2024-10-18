import { reactNode } from '@packages/node'
import { enums, getEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/aside-v1.0.0'

export default reactNode(
	'Aside',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'propsFunction', 'opacity']),
				...inputGroups.Paddings,
				getPort({
					plug: 'input',
					name: 'asideWithBorder',
					displayName: 'With border',
					group: 'Style',
					type: 'boolean',
					default: true,
				}),
				getPort({
					plug: 'input',
					name: 'asideWidth',
					displayName: 'Width (responsive)',
					group: 'Dimensions',
					type: 'array',
					customs: {
						required: 'connection',
						isObject: true,
					},
				}),
				getPort({
					plug: 'input',
					name: 'asideHiddenBreakpoint',
					displayName: 'Hidden breakpoint',
					group: 'Layout',
					type: getEnumType(enums.sizes, 'editor'),
					default: 'sm',
				}),
			],
		},
	},
	{ allowChildren: true }
)

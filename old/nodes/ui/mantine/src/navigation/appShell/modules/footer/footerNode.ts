import { reactNode } from '@packages/node'
import { getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/footer-v1.0.0'

export default reactNode(
	'Footer',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'propsFunction', 'opacity']),
				...inputGroups.Paddings,
				getPort({
					plug: 'input',
					name: 'footerWithBorder',
					displayName: 'With border',
					group: 'Style',
					type: 'boolean',
					default: true,
				}),
				getPort({
					plug: 'input',
					name: 'footerHeight',
					displayName: 'Height (breakpoints)',
					group: 'Dimensions',
					type: 'array',
					customs: {
						required: 'connection',
						isObject: true,
					},
				}),
			],
		},
	},
	{ allowChildren: true }
)

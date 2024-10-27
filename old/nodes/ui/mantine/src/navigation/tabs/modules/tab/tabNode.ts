import { reactNode } from '@packages/node'
import { getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/tab-v1.0.0'

export default reactNode(
	'Tab',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'propsFunction', 'label', 'color', 'disabled']),
				...inputGroups.Icon,
				getPort({
					plug: 'input',
					name: 'value',
					displayName: 'Value',
					group: 'Data',
					type: 'string',
					customs: { required: 'connection' },
				}),
			],
			outputs: getPorts('output', ['clicked']),
		},
	},
	{ allowChildren: true }
)

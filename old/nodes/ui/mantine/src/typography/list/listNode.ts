import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/list-v1.0.0'

export default reactNode('List', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', ['customProps', 'propsFunction', 'useScope', 'size']),
			...inputGroups.Icon,
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['table']),
				default: 'table',
				customs: {
					required: 'connection',
					dependsOn(props) {
						return props.useScope ? true : false
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'listScheme',
				displayName: 'Scheme',
				group: 'Params',
				type: 'array',
				customs: { required: 'connection' },
			}),
			getPort({
				plug: 'input',
				name: 'listType',
				displayName: 'Type',
				group: 'Params',
				type: getCustomEnumType(['unordered', 'ordered']),
				default: 'unordered',
				customs: { required: 'both' },
			}),
			getPort({
				plug: 'input',
				name: 'withPadding',
				displayName: 'With padding',
				group: 'Layout',
				type: 'boolean',
				default: false,
			}),
		],
	},
})

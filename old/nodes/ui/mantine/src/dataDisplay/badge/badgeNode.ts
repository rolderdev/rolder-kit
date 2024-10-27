import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

const variants = ['light', 'filled', 'outline', 'dot', 'gradient']

import v100 from '@packages/badge-v1.0.0'

export default reactNode('Badge', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', ['customProps', 'propsFunction', 'useScope', 'size', 'radius', 'color', 'label', 'fullWidth', 'w']),
			...inputGroups.Margins,
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['table']),
				default: 'table',
				customs: {
					required: 'both',
					dependsOn(props) {
						return props.useScope ? true : false
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'badgeVariant',
				displayName: 'Variant',
				group: 'Style',
				type: getCustomEnumType(variants),
				default: 'light',
				customs: { required: 'both' },
			}),
			getPort({
				plug: 'input',
				name: 'gradient',
				displayName: 'Gradient',
				group: 'Style',
				type: 'array',
				customs: {
					required: 'both',
					dependsOn(props) {
						return props.badgeVariant === 'gradient'
					},
				},
			}),
		],
	},
})

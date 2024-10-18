import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/nav-link-v1.0.0'

export default reactNode(
	'NavLink',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...inputGroups.Icon,
				...getPorts('input', ['customProps', 'propsFunction', 'useScope', 'active', 'label', 'color', 'description']),
				getPort({
					plug: 'input',
					name: 'scope',
					displayName: 'Scope',
					group: 'Scope',
					type: getCustomEnumType(['table']),
					default: 'table',
					customs: {
						required: 'connection',
						dependsOn(p) {
							return p.useScope ? true : false
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'navLinkVariant',
					displayName: 'Variant',
					group: 'Style',
					type: getCustomEnumType(['light', 'filled', 'outline']),
					default: 'light',
					customs: { required: 'connection' },
				}),
				getPort({
					plug: 'input',
					name: 'activateLabel',
					displayName: 'Activate label',
					group: 'States',
					type: 'string',
				}),
			],
			outputs: getPorts('output', ['clicked']),
		},
	},
	{ allowChildren: true }
)

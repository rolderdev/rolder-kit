import { reactNode } from '@packages/node'
import { defaultUnits, enums, getCustomEnumType, getEnumType, getPort, getPorts, getUnitType } from '@packages/port'

import v100 from '@packages/app-shell-v1.0.0'

export default reactNode(
	'AppShell',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				...getPorts('input', ['customProps', 'propsFunction', 'opacity']),
				getPort({
					plug: 'input',
					name: 'appShellLayout',
					displayName: 'Layout',
					group: 'Layout',
					type: getCustomEnumType(['default', 'alt'], false, 'editor'),
					default: 'default',
				}),
				getPort({
					plug: 'input',
					name: 'hiddenAppShell',
					displayName: 'Hidden',
					group: 'Layout',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'appShellPadding',
					displayName: 'Padding',
					group: 'Dimensions',
					type: getEnumType(enums.sizes),
					default: 'md',
					customs: {
						dependsOn(p) {
							return p.appShellCustomPadding ? false : true
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'appShellCustomPadding',
					displayName: 'Custom padding',
					group: 'Dimensions',
					type: getUnitType(defaultUnits, 'rem'),
				}),
			],
		},
	},
	{ allowChildren: true }
)

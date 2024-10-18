import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v010 from '@packages/copy-button-v0.1.0'

export default reactNode(
	'CopyButton',
	{
		'v0.1.0': {
			module: { static: v010 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'copyValue',
					displayName: 'Copy value',
					group: 'Data',
					type: 'string',
					customs: { required: 'connection' },
				}),
				getPort({
					plug: 'input',
					name: 'copiedLabel',
					displayName: 'Copied label',
					group: 'Params',
					type: 'string',
					default: 'Скопировано',
				}),
				getPort({
					plug: 'input',
					name: 'timeout',
					displayName: 'Timeout',
					group: 'Params',
					type: 'number',
					default: 500,
				}),
				getPort({
					plug: 'input',
					name: 'buttonType',
					displayName: 'Button type',
					group: 'Params',
					type: getCustomEnumType(['submit']),
				}),
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
					name: 'buttonVariant',
					displayName: 'Variant',
					group: 'Style',
					type: getCustomEnumType(['default', 'filled', 'subtle', 'outline', 'light', 'gradient', 'white']),
					default: 'filled',
					customs: { required: 'connection' },
				}),
				getPort({
					plug: 'input',
					name: 'copiedColor',
					displayName: 'Copied color',
					group: 'Style',
					type: 'string',
					default: 'teal',
				}),
				...inputGroups.Margins,
				...inputGroups.Icon,
				...getPorts('input', [
					'customProps',
					'propsFunction',
					'useScope',
					'label',
					'disabled',
					'size',
					'radius',
					'color',
					'loading',
				]),
			],
			outputs: getPorts('output', ['clicked']),
		},
	},
	{ docs: 'https://docs.rolder.app/#/copybutton' }
)

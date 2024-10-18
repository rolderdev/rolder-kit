import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts } from '@packages/port'

import v010 from '@packages/switch-v0.1.0'
import v101 from '@packages/switch-v1.0.1'

export default reactNode(
	'Switch',
	{
		'v0.1.0': {
			hashTag: '#pre-release',
			module: { static: v010 },
			inputs: [
				...getPorts('input', [
					'customProps',
					'propsFunction',
					'useScope',
					'label',
					'disabled',
					'w',
					'color',
					'inputError',
					'reset',
					'formField',
					'radius',
					'size',
					'description',
				]),
				getPort({
					plug: 'input',
					name: 'inputChecked',
					displayName: 'Checked',
					group: 'States',
					default: false,
					type: 'boolean',
				}),
				getPort({
					plug: 'input',
					name: 'labelPosition',
					displayName: 'Label position',
					group: 'Layout',
					default: 'right',
					type: getCustomEnumType(['right', 'left']),
					customs: { required: 'connection' },
				}),
				getPort({
					plug: 'input',
					name: 'scope',
					displayName: 'Scope',
					group: 'Scope',
					type: getCustomEnumType(['form']),
					default: 'form',
					customs: {
						required: 'connection',
						dependsOn(p) {
							return p.useScope ? true : false
						},
					},
				}),
			],
			outputs: getPorts('output', ['changed', 'checked']),
		},
		'v1.0.1': {
			module: { static: v101 },
			inputs: [
				...getPorts('input', [
					'customProps',
					'propsFunction',
					'useScope',
					'label',
					'disabled',
					'w',
					'color',
					'inputError',
					'reset',
					'formField',
					'radius',
					'size',
					'description',
				]),
				getPort({
					plug: 'input',
					name: 'inputChecked',
					displayName: 'Checked',
					group: 'States',
					default: false,
					type: 'boolean',
				}),
				getPort({
					plug: 'input',
					name: 'labelPosition',
					displayName: 'Label position',
					group: 'Layout',
					default: 'right',
					type: getCustomEnumType(['right', 'left']),
					customs: { required: 'connection' },
				}),
				getPort({
					plug: 'input',
					name: 'scope',
					displayName: 'Scope',
					group: 'Scope',
					type: getCustomEnumType(['form']),
					default: 'form',
					customs: {
						required: 'connection',
						dependsOn(p) {
							return p.useScope ? true : false
						},
					},
				}),
			],
			outputs: getPorts('output', ['changed', 'checked']),
		},
	},
	{ docs: 'https://docs.rolder.app/#/switch' }
)

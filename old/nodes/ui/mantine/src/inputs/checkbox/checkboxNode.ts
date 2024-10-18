import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts } from '@packages/port'

import v100 from '@packages/checkbox-v1.0.0'

export default reactNode('Checkbox', {
	'v1.0.0': {
		module: { static: v100 },
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
})

import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/number-input-v1.0.0'

export default reactNode('NumberInput', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'label',
				'placeholder',
				'description',
				'disabled',
				'radius',
				'withAsterisk',
				'w',
				'inputError',
				'hideControls',
				'size',
				'min',
				'max',
				'step',
				'reset',
				'increment',
				'decrement',
			]),
			...inputGroups.Form,
			...inputGroups.Icon,
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
			getPort({
				plug: 'input',
				name: 'numberInputVariant',
				displayName: 'Variant',
				group: 'Style',
				type: getCustomEnumType(['default', 'filled', 'unstyled']),
				default: 'default',
				customs: { required: 'connection' },
			}),
			getPort({
				plug: 'input',
				name: 'defaultNumberValue',
				displayName: 'Default value',
				group: 'Data',
				type: 'number',
				customs: {
					dependsOn(p) {
						return p.useScope ? false : true
					},
				},
			}),
		],
		outputs: [
			...getPorts('output', ['changed', 'reseted']),
			getPort({ plug: 'output', name: 'value', displayName: 'Value', group: 'Data', type: 'number' }),
		],
	},
})

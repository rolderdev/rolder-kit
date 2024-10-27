import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/text-input-v1.0.0'
import v110 from '@packages/text-input-v1.1.0'

export default reactNode('TextInput', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'label',
				'placeholder',
				'disabled',
				'withAsterisk',
				'w',
				'inputError',
				'reset',
				'focusRightSection',
				'debouncedTyping',
				'typingDelay',
				'radius',
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
				name: 'inputValue',
				displayName: 'Value',
				group: 'Data',
				type: 'string',
				customs: {
					dependsOn(p) {
						return p.useScope ? false : true
					},
				},
			}),
		],
		outputs: getPorts('output', ['typedValue', 'reseted']),
	},
	'v1.1.0': {
		module: { static: v110 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'label',
				'placeholder',
				'disabled',
				'withAsterisk',
				'w',
				'inputError',
				'reset',
				'focusRightSection',
				'debouncedTyping',
				'typingDelay',
				'radius',
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
				name: 'inputValue',
				displayName: 'Value',
				group: 'Data',
				type: 'string',
				customs: {
					dependsOn(p) {
						return p.useScope ? false : true
					},
				},
			}),
		],
		outputs: getPorts('output', ['typedValue', 'reseted', 'changed']),
	},
})

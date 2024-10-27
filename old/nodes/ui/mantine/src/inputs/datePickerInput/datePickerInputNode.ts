import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/date-picker-input-v1.0.0'
import v101 from '@packages/date-picker-input-v1.0.1'

export default reactNode('DatePickerInput', {
	'v1.0.0': {
		hashTag: '#deprecated',
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
				'radius',
				'clearable',
				'limitMinDate',
				'minDateOffset',
				'formField',
				'dropdownType',
			]),
			getPort({
				plug: 'input',
				name: 'valueFormat',
				displayName: 'Date format',
				group: 'Params',
				default: 'YYYY.MM.DD HH:mm',
				type: 'string',
				customs: { required: 'connection', projectDefaultKey: 'dateFormat' },
			}),
			getPort({ plug: 'input', name: 'dateValue', displayName: 'Date value', group: 'Data', type: '*' }),
			getPort({
				plug: 'input',
				name: 'datePickerType',
				displayName: 'Type',
				group: 'Params',
				default: 'default',
				type: getCustomEnumType(['default', 'range', 'multiple']),
				customs: { required: 'connection' },
			}),
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
		],
		outputs: [
			...getPorts('output', ['changed', 'reseted']),
			getPort({ plug: 'output', name: 'dateValue', displayName: 'Date value', group: 'Data', type: '*' }),
		],
	},
	'v1.0.1': {
		module: { static: v101 },
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
				'radius',
				'clearable',
				'limitMinDate',
				'minDateOffset',
				'formField',
				'dropdownType',
			]),
			getPort({
				plug: 'input',
				name: 'valueFormat',
				displayName: 'Date format',
				group: 'Params',
				default: 'YYYY.MM.DD HH:mm',
				type: 'string',
				customs: { required: 'connection', projectDefaultKey: 'dateFormat' },
			}),
			getPort({ plug: 'input', name: 'dateValue', displayName: 'Date value', group: 'Data', type: '*' }),
			getPort({
				plug: 'input',
				name: 'datePickerType',
				displayName: 'Type',
				group: 'Params',
				default: 'default',
				type: getCustomEnumType(['default', 'range', 'multiple']),
				customs: { required: 'connection' },
			}),
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
		],
		outputs: [
			...getPorts('output', ['changed', 'reseted']),
			getPort({ plug: 'output', name: 'dateValue', displayName: 'Date value', group: 'Data', type: '*' }),
		],
	},
})

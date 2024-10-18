import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'

import v100 from '@packages/date-time-picker-v1.0.0'

export default reactNode('DateTimePicker', {
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
				'radius',
				'clearable',
				'limitMinDate',
				'minDateOffset',
				'defaultDate',
				'resetSelected',
				'formField',
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
		outputs: getPorts('output', ['selected', 'selectedDate']),
	},
})

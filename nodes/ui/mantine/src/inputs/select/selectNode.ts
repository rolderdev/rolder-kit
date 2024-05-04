import { reactNode } from '@packages/node';
import { getCustomEnumType, getPort, getPorts, getType, inputGroups } from '@packages/port';

import v100 from '@packages/select-v1.0.0';
import v110 from '@packages/select-v1.1.0';

export default reactNode('Select', {
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
				'formField',
				'labelField',
				'radius',
				'inputItems',
				'searchable',
				'clearable',
				'creatable',
				'backgroundColor',
				'defaultItem',
				'maxDropdownHeight',
				'dropdownPosition',
				'size',
				'resetSelected'
			]),
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
						return p.useScope ? true : false;
					}
				}
			})
		],
		outputs: getPorts('output', ['selected', 'newValueSubmited', 'selectedItem', 'newValue', 'reseted'])
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
				'formField',
				'labelField',
				'radius',
				'inputItems',
				'searchable',
				'clearable',
				'creatable',
				'backgroundColor',
				'maxDropdownHeight',
				'dropdownPosition',
				'size',
				'resetSelected'
			]),
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
						return p.useScope ? true : false;
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'selectedItem',
				displayName: 'Selected item',
				group: 'Data',
				type: getType('object', 'connection'),
				customs: {
					dependsOn(p) {
						return p.useScope ? false : true;
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'select',
				displayName: 'Select',
				group: 'Signals',
				type: 'signal',
				customs: {
					dependsOn(p) {
						return p.useScope ? false : true;
					}
				}
			})
		],
		outputs: getPorts('output', ['selected', 'newValueSubmited', 'selectedItem', 'newValue', 'reseted'])
	}
});

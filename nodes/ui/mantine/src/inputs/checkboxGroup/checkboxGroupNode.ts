import { reactNode } from '@packages/node';
import { enums, getCustomEnumType, getEnumType, getPort, getPorts } from '@packages/port';

import v100 from '@packages/checkbox-group-v1.0.0';

export default reactNode('CheckboxGroup', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'disabled',
				'w',
				'formField',
				'labelField',
				'inputItems',
				'defaultItems',
				'label',
				'withAsterisk',
				'grow',
				'resetSelected'
			]),
			getPort({
				plug: 'input',
				name: 'orientation',
				displayName: 'Orientation',
				group: 'Layout',
				default: 'horizontal',
				type: getEnumType(enums.orientations)
			}),
			getPort({
				plug: 'input',
				name: 'checkBoxFz',
				displayName: 'Font size',
				group: 'Checkbox',
				default: 'sm',
				type: getEnumType(enums.sizes)
			}),
			getPort({ plug: 'input', name: 'checkboxColor', displayName: 'Color', group: 'Checkbox', type: 'string' }),
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
		outputs: getPorts('output', ['selected', 'selectedItems'])
	}
});

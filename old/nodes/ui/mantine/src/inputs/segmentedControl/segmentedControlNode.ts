import { reactNode } from '@packages/node';
import { enums, getCustomEnumType, getEnumType, getPort, getPorts } from '@packages/port';

import v100 from '@packages/segmented-control-v1.0.0';

export default reactNode('SegmentedControl', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', [
				'customProps',
				'propsFunction',
				'useScope',
				'disabled',
				'w',
				'radius',
				'formField',
				'labelField',
				'inputItems',
				'defaultItem',
				'fullWidth',
				'size'
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
		outputs: getPorts('output', ['selected', 'selectedItem'])
	}
});

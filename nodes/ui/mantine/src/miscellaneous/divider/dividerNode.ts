import { reactNode } from '@packages/node';
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port';

import v100 from '@packages/divider-v1.0.0';

export default reactNode('Divider', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...inputGroups.Margins,
			...getPorts('input', ['customProps', 'propsFunction', 'size', 'label']),
			getPort({
				plug: 'input',
				name: 'dividerVariant',
				displayName: 'Variant',
				group: 'Style',
				type: getCustomEnumType(['solid', 'dashed', 'dotted']),
				default: 'solid',
				customs: { required: 'both' }
			}),
			getPort({
				plug: 'input',
				name: 'dividerOrientation',
				displayName: 'Orientation',
				group: 'Layout',
				type: getCustomEnumType(['horizontal', 'vertical']),
				default: 'horizontal',
				customs: { required: 'both' }
			}),
			getPort({
				plug: 'input',
				name: 'dividerLabelPosition',
				displayName: 'Label position',
				group: 'Layout',
				type: getCustomEnumType(['left', 'right', 'center']),
				default: 'left',
				customs: { required: 'both' }
			})
		]
	}
});

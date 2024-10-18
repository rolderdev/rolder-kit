import { reactNode } from '@packages/node'
import { defaultUnits, getCustomEnumType, getMantinePort, getPort, getPorts, getUnitType } from '@packages/port'

import v100 from '@packages/image-v1.0.0'

export default reactNode('Image', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', ['customProps', 'propsFunction', 'useScope', 'src', 'height']),
			getMantinePort('radius', { comp: 'Image', prop: 'radius' }),
			getPort({
				plug: 'input',
				name: 'width',
				displayName: 'Width',
				group: 'Dimensions',
				type: getUnitType(defaultUnits, '%'),
				default: 100,
			}),
			getPort({
				plug: 'input',
				name: 'scope',
				displayName: 'Scope',
				group: 'Scope',
				type: getCustomEnumType(['table']),
				default: 'table',
				customs: {
					required: 'connection',
					dependsOn(props) {
						return props.useScope ? true : false
					},
				},
			}),
			getPort({
				plug: 'input',
				name: 'withPlaceholder',
				displayName: 'Placeholder',
				group: 'Placeholder',
				type: 'boolean',
				default: true,
			}),
			getPort({
				plug: 'input',
				name: 'placeholderIconSize',
				displayName: 'Placeholder icon size',
				group: 'Placeholder',
				type: getUnitType(defaultUnits, 'px'),
				default: 24,
				customs: {
					dependsOn(props) {
						return props.withPlaceholder ? true : false
					},
				},
			}),
		],
	},
})

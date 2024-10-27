import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts } from '@packages/port'

import v100 from '@packages/loader-v1.0.0'

export default reactNode('Loader', {
	'v1.0.0': {
		module: { static: v100 },
		inputs: [
			...getPorts('input', ['customProps', 'color', 'size']),
			getPort({
				plug: 'input',
				name: 'loaderVariant',
				displayName: 'Variant',
				group: 'Style',
				default: 'oval',
				type: getCustomEnumType(['oval', 'bars', 'dots']),
			}),
		],
	},
})

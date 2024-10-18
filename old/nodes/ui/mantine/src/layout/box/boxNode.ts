import { reactNode } from '@packages/node'
import { getPorts } from '@packages/port'

import v100 from '@packages/box-v1.0.0'

export default reactNode(
	'Box',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: getPorts('input', ['customProps', 'opacity']),
		},
	},
	{ allowChildren: true }
)

import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort } from '@packages/port'

import v100 from '@packages/pdf-page-v1.0.0'

export default reactNode(
	'PdfPage',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'orientation',
					displayName: 'Orientation',
					group: 'Params',
					type: getCustomEnumType(['portrait', 'landscape']),
					default: 'portrait',
					customs: { required: 'connection' },
				}),
			],
		},
	},
	{ allowChildren: true }
)

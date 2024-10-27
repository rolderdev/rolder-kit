import { reactNode } from '@packages/node'
import { getPort } from '@packages/port'

import v100 from '@packages/pdf-view-v1.0.0'

export default reactNode(
	'PdfView',
	{
		'v1.0.0': {
			module: { static: v100 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'wrap',
					displayName: 'Wrap',
					group: 'Params',
					type: 'boolean',
					default: true,
					customs: { required: 'connection' },
				}),
				getPort({
					plug: 'input',
					name: 'fixed',
					displayName: 'Fixed',
					group: 'Params',
					type: 'boolean',
					default: false,
					customs: { required: 'connection' },
				}),
			],
		},
	},
	{ allowChildren: true }
)

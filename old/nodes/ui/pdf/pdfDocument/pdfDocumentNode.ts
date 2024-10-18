import { reactNode } from '@packages/node'
import { getPort, getPorts } from '@packages/port'

import v100 from '@packages/pdf-document-v1.0.0'
import v110 from '@packages/pdf-document-v1.1.0'
import v120 from '@packages/pdf-document-v1.2.0'

export default reactNode(
	'PdfDocument',
	{
		'v1.0.0': {
			hashTag: '#deprecated',
			module: { static: v100 },
			inputs: getPorts('input', ['create']),
			outputs: getPorts('output', ['creating', 'created', 'blob']),
		},
		'v1.1.0': {
			hashTag: '#deprecated',
			module: { static: v110 },
			inputs: [
				...getPorts('input', ['create']),
				getPort({ plug: 'input', name: 'fonts', displayName: 'Fonts', group: 'Style', type: 'array' }),
			],
			outputs: getPorts('output', ['creating', 'created', 'blob']),
		},
		'v1.2.0': {
			module: { static: v120 },
			inputs: [
				...getPorts('input', ['create', 'reset']),
				getPort({ plug: 'input', name: 'fonts', displayName: 'Fonts', group: 'Style', type: 'array' }),
			],
			outputs: getPorts('output', ['creating', 'created', 'blob', 'reseted']),
		},
	},
	{ allowChildren: true }
)

import { reactNode } from '@packages/node'
import { getPort } from '@packages/port'
import { lazy } from 'react'

export default reactNode(
	'Form',
	{
		'v1.0.0': {
			module: {
				dynamic: lazy(() => import('@packages/form-v1.0.0')),
			},
			inputs: [
				getPort({
					plug: 'input',
					name: 'formScheme',
					displayName: 'Scheme',
					group: 'Params',
					type: 'array',
					customs: { isObject: true, required: 'connection' },
				}),
			],
			outputs: [
				getPort({ plug: 'output', name: 'formHook', displayName: 'Form hook', group: 'Form', type: 'object' }),
				getPort({ plug: 'output', name: 'submited', displayName: 'Submited', group: 'Signals', type: 'signal' }),
			],
		},
	},
	{ allowChildren: true }
)

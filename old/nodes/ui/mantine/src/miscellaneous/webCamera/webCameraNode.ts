import { reactNode } from '@packages/node'
import { getPort } from '@packages/port'
import { lazy } from 'react'

export default reactNode(
	'WebCamera',
	{
		'v1.0.0': {
			module: {
				dynamic: lazy(() => import('@packages/web-camera-v1.0.0')),
			},
			inputs: [
				getPort({
					plug: 'input',
					name: 'iconSize',
					displayName: 'Icon size',
					group: 'Params',
					type: 'number',
					default: 48,
				}),
				getPort({ plug: 'input', name: 'shoot', displayName: 'Shoot photo', group: 'Signals', type: 'signal' }),
			],
			outputs: [
				getPort({ plug: 'output', name: 'connected', displayName: 'Connected', group: 'Sate', type: 'boolean', default: false }),
				getPort({ plug: 'output', name: 'dataUri', displayName: 'Photo DataURI', group: 'Data', type: 'string' }),
				getPort({ plug: 'output', name: 'shot', displayName: 'Shot', group: 'Signals', type: 'signal' }),
			],
		},
	},
	{ allowChildren: true }
)

//===================================================================

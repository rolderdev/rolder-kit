import { reactNode } from '@packages/node'
import { getPort, getType } from '@packages/port'
import { lazy } from 'react'

export default reactNode(
	'LocalData',
	{
		'v0.1.0': {
			hashTag: '#expreimental',
			module: {
				dynamic: lazy(() => import('@packages/local-data-v0.1.0')),
			},
			inputs: [
				getPort({
					plug: 'input',
					name: 'dbName',
					displayName: 'DB name',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'collectionsDefinition',
					displayName: 'Collections definition',
					group: 'Params',
					type: getType('array', 'connection'),
					customs: {
						required: 'connection',
						isObject: true,
					},
				}),
				getPort({
					plug: 'input',
					name: 'backendDevMode',
					displayName: 'Dev mode',
					group: 'Params',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'backendHost',
					displayName: 'Host',
					group: 'Params',
					type: 'string',
					default: 'localhost',
					customs: {
						dependsOn(p) {
							return p.backendDevMode ? true : false
						},
					},
				}),
			],
			outputs: [
				getPort({
					plug: 'output',
					name: 'replicating',
					displayName: 'Replicating',
					group: 'States',
					type: 'boolean',
					default: true,
				}),
				getPort({
					plug: 'output',
					name: 'replicated',
					displayName: 'Replicated',
					group: 'Signals',
					type: 'signal',
				}),
			],
		},
	},
	{ allowChildren: true }
)

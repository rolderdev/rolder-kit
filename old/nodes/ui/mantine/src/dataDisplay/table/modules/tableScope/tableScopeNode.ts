import { reactNode } from '@packages/node'
import { getPort } from '@packages/port'

import v010 from '@packages/table-scope-v0.1.0'

export default reactNode(
	'TableScope',
	{
		'v0.1.0': {
			hashTag: '#expreimental',
			module: { static: v010 },
			inputs: [
				getPort({
					plug: 'input',
					name: 'multiSelectionFilterFunc',
					displayName: 'Multi selection filter func',
					group: 'Selection',
					type: 'array',
					customs: { isObject: true },
				}),
				getPort({
					plug: 'input',
					name: 'selectionDbClasses',
					displayName: 'Selection DB classes',
					group: 'Selection DB classes',
					type: 'proplist',
					customs: {
						addNodePorts(selectionDbClasses) {
							if (selectionDbClasses)
								return selectionDbClasses.map((i: any) => ({
									plug: 'output',
									name: i,
									group: 'Data',
									type: 'array',
									displayName: `Selected ${i}`,
								}))
							else return []
						},
					},
				}),
			],
			outputs: [
				getPort({
					plug: 'output',
					name: 'hierarchy',
					displayName: 'Hierarchy',
					group: 'Data',
					type: 'object',
				}),
			],
		},
	},
	{ allowChildren: true }
)

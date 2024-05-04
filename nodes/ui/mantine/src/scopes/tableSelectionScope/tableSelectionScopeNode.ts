import { reactNode } from '@packages/node';
import { getPort, getPorts } from '@packages/port';
import { lazy } from 'react';

export default reactNode(
	'TableSelectionScope',
	{
		'v1.0.0': {
			module: {
				dynamic: lazy(() => import('@packages/table-selection-scope-v1.0.0'))
			},
			inputs: [
				...getPorts('input', ['reset']),
				getPort({ plug: 'input', name: 'newSelectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' })
			],
			outputs: [
				getPort({ plug: 'output', name: 'selectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' }),
				getPort({ plug: 'output', name: 'selectionByDBClass', displayName: 'selectionByDBClass', group: 'Data', type: 'object' }),
				getPort({ plug: 'output', name: 'changed', displayName: 'changed', group: 'Signals', type: 'signal' })
			]
		},
		'v1.0.1': {
			module: {
				dynamic: lazy(() => import('@packages/table-selection-scope-v1.0.1'))
			},
			inputs: [
				...getPorts('input', ['reset']),
				getPort({ plug: 'input', name: 'newSelectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' })
			],
			outputs: [
				getPort({ plug: 'output', name: 'selectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' }),
				getPort({ plug: 'output', name: 'selectionByDBClass', displayName: 'selectionByDBClass', group: 'Data', type: 'object' }),
				getPort({ plug: 'output', name: 'changed', displayName: 'changed', group: 'Signals', type: 'signal' })
			]
		},
		'v1.1.0': {
			module: {
				dynamic: lazy(() => import('@packages/table-selection-scope-v1.1.0'))
			},
			inputs: [
				...getPorts('input', ['reset']),
				getPort({ plug: 'input', name: 'newSelectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' })
			],
			outputs: [
				getPort({ plug: 'output', name: 'selectionScope', displayName: 'selectionScope', group: 'Data', type: 'object' }),
				getPort({ plug: 'output', name: 'selectionByDBClass', displayName: 'selectionByDBClass', group: 'Data', type: 'object' }),
				getPort({ plug: 'output', name: 'changed', displayName: 'changed', group: 'Signals', type: 'signal' })
			]
		}
	},
	{ allowChildren: true }
);

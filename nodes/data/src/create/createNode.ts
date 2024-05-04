import { jsNode } from '@packages/node';
import { getPort, getPorts } from '@packages/port';

export default jsNode('create', {
	'v0.4.0': {
		module: {
			dynamic: import('@packages/create-v0.4.0')
		},
		inputs: [
			...getPorts('input', ['create']),
			getPort({
				plug: 'input',
				name: 'createScheme',
				displayName: 'Create scheme',
				group: 'Data',
				type: 'array',
				customs: { required: 'connection' }
			})
		],
		outputs: [
			...getPorts('output', ['created', 'creating']),
			getPort({ plug: 'output', name: 'createdData', displayName: 'Created data', group: 'Data', type: 'object' })
		]
	},
	'v1.0.0': {
		module: {
			dynamic: import(
				/* webpackPrefetch: true */
				/* webpackPreload: true */
				'@packages/create-v1.0.0'
			)
		},
		inputs: getPorts('input', ['create', 'scheme']),
		outputs: getPorts('output', ['created', 'creating', 'data'])
	}
});

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
	},
	'v1.1.0': {
		module: {
			dynamic: import(
				/* webpackPrefetch: true */
				/* webpackPreload: true */
				'@packages/create-v1.1.0'
			)
		},
		inputs: [
			...getPorts('input', ['create']),
			getPort({
				plug: 'input',
				name: 'scheme',
				displayName: 'Scheme',
				group: 'Params',
				type: 'array',
				customs: {
					required: 'connection',
					validate(p) {
						if (!p.scheme) return true;
						else {
							const sizeDbClasses: string[] = [];
							p.scheme.map((i: any) => {
								if (i.items?.length > 20000) sizeDbClasses.push(i.dbClass);
							});
							if (sizeDbClasses.length) {
								return `You can update 20000 or less documents per request. Mismatched DB classes: ${sizeDbClasses.join(', ')}`;
							} else return true;
						}
					}
				}
			}),
			getPort({
				plug: 'input',
				name: 'silent',
				displayName: 'Silent',
				group: 'Params',
				type: 'boolean',
				default: false
			})
		],
		outputs: getPorts('output', ['created', 'creating', 'data'])
	}
});

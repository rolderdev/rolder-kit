import { jsNode } from '@packages/node';
import { getPort, getPorts } from '@packages/port';

export default jsNode('delete', {
	'v0.3.0': {
		module: { dynamic: import('@packages/delete-v0.3.0') },
		inputs: [
			...getPorts('input', ['delete']),
			getPort({
				plug: 'input',
				name: 'deleteScheme',
				displayName: 'Delete scheme',
				group: 'Data',
				type: 'array',
				customs: { required: 'connection' }
			})
		],
		outputs: getPorts('output', ['deleted', 'deleting'])
	},
	'v1.0.0': {
		module: { dynamic: import('@packages/delete-v1.0.0') },
		inputs: getPorts('input', ['delete', 'scheme']),
		outputs: getPorts('output', ['deleted', 'deleting'])
	},
	'v1.1.0': {
		module: { dynamic: import('@packages/delete-v1.1.0') },
		inputs: [
			...getPorts('input', ['delete', 'scheme']),
			getPort({
				plug: 'input',
				name: 'silent',
				displayName: 'Silent',
				group: 'Params',
				type: 'boolean',
				default: false
			})
		],
		outputs: getPorts('output', ['deleted', 'deleting'])
	}
});

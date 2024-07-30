import { jsNode } from '@packages/node';
import { getPort, getPorts } from '@packages/port';

export default jsNode(
	'saveAs',
	{
		'v1.0.0': {
			module: { dynamic: import('@packages/save-as-v1.0.0') },
			inputs: [
				getPort({ plug: 'input', name: 'saveAs', displayName: 'Save as', group: 'Signals', type: 'signal' }),
				getPort({
					plug: 'input',
					name: 'blob',
					displayName: 'Blob',
					group: 'Data',
					type: '*',
					customs: { required: 'connection' }
				}),
				...getPorts('input', ['fileName'])
			]
		}
	},
	{ color: 'purple' }
);

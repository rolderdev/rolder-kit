import { jsNode } from '@packages/node';
import { getCustomEnumType, getPort } from '@packages/port';

export default jsNode(
	'nodered',
	{
		'v1.0.0': {
			hashTag: '#deprecated',
			module: {
				dynamic: import('@packages/nodered-v1.0.0'),
			},
			inputs: [
				getPort({ plug: 'input', name: 'execute', displayName: 'Execute', group: 'Signals', type: 'signal' }),
				getPort({
					plug: 'input',
					name: 'flowEndpoint',
					displayName: 'Flow endpoint',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({ plug: 'input', name: 'flowData', displayName: 'Flow data', group: 'Data', type: '*' }),
			],
			outputs: [
				getPort({
					plug: 'output',
					name: 'executing',
					displayName: 'Executing',
					group: 'States',
					type: 'boolean',
					default: false,
				}),
				getPort({ plug: 'output', name: 'executed', displayName: 'Executed', group: 'Signals', type: 'signal' }),
				getPort({ plug: 'output', name: 'result', displayName: 'Result', group: 'Data', type: '*' }),
			],
		},
		'v1.0.1': {
			module: {
				dynamic: import('@packages/nodered-v1.0.1'),
			},
			inputs: [
				getPort({ plug: 'input', name: 'execute', displayName: 'Execute', group: 'Signals', type: 'signal' }),
				getPort({
					plug: 'input',
					name: 'flowEndpoint',
					displayName: 'Flow endpoint',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({ plug: 'input', name: 'flowData', displayName: 'Flow data', group: 'Data', type: '*' }),
			],
			outputs: [
				getPort({
					plug: 'output',
					name: 'executing',
					displayName: 'Executing',
					group: 'States',
					type: 'boolean',
					default: false,
				}),
				getPort({ plug: 'output', name: 'executed', displayName: 'Executed', group: 'Signals', type: 'signal' }),
				getPort({ plug: 'output', name: 'result', displayName: 'Result', group: 'Data', type: '*' }),
			],
		},
		'v1.1.0': {
			// Vezdexod
			hashTag: '#pre-release',
			module: {
				dynamic: import('@packages/nodered-v1.1.0'),
			},
			inputs: [
				getPort({ plug: 'input', name: 'execute', displayName: 'Execute', group: 'Signals', type: 'signal' }),
				getPort({
					plug: 'input',
					name: 'flowEndpoint',
					displayName: 'Flow endpoint',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({
					// Vezdexod
					plug: 'input',
					name: 'timeout',
					displayName: 'timeout',
					group: 'Params',
					type: 'number',
					default: 10000,
				}),
				getPort({ plug: 'input', name: 'flowData', displayName: 'Flow data', group: 'Data', type: '*' }),
			],
			outputs: [
				getPort({
					plug: 'output',
					name: 'executing',
					displayName: 'Executing',
					group: 'States',
					type: 'boolean',
					default: false,
				}),
				getPort({ plug: 'output', name: 'executed', displayName: 'Executed', group: 'Signals', type: 'signal' }),
				getPort({ plug: 'output', name: 'result', displayName: 'Result', group: 'Data', type: '*' }),
			],
		},
		'v1.1.1': {
			module: { dynamic: import('@packages/nodered-v1.1.1') },
			inputs: [
				getPort({ plug: 'input', name: 'execute', displayName: 'Execute', group: 'Signals', type: 'signal' }),
				getPort({
					plug: 'input',
					name: 'flowEndpoint',
					displayName: 'Flow endpoint',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'timeout',
					displayName: 'timeout',
					group: 'Params',
					type: 'number',
					default: 10000,
				}),
				getPort({ plug: 'input', name: 'flowData', displayName: 'Flow data', group: 'Data', type: '*' }),
			],
			outputs: [
				getPort({
					plug: 'output',
					name: 'executing',
					displayName: 'Executing',
					group: 'States',
					type: 'boolean',
					default: false,
				}),
				getPort({ plug: 'output', name: 'executed', displayName: 'Executed', group: 'Signals', type: 'signal' }),
				getPort({ plug: 'output', name: 'result', displayName: 'Result', group: 'Data', type: '*' }),
			],
		},
		'v1.2.0': { // Vezdexod
			module: {
				dynamic: import('@packages/nodered-v1.2.0')
			},
			inputs: [
				getPort({ plug: 'input', name: 'execute', displayName: 'Execute', group: 'Signals', type: 'signal' }),
				getPort({
					plug: 'input',
					name: 'flowEndpoint',
					displayName: 'Flow endpoint',
					group: 'Params',
					type: 'string',
					// customs: { required: 'both' }
					customs: {
						required: 'connection',
						dependsOn(p) {
							return p.useServices ? false : true;
						}
					}
				}),
				getPort({ 							// Vezdexod
					plug: 'input',
					name: 'timeout',
					displayName: 'timeout',
					group: 'Params',
					type: 'number',
					default: 10000
				}),
				getPort({ 							// Vezdexod
					plug: 'input',
					name: 'useServices',
					displayName: 'Use Services',
					group: 'Services',
					type: 'boolean',
					default: false
				}),
				getPort({
					plug: 'input',
					name: 'selectedService',
					displayName: 'Service',
					group: 'Services',
					type: getCustomEnumType(['upload-files']),
					default: 'upload-files',
					customs: {
						required: 'connection',
						dependsOn(p) {
							return p.useServices ? true : false;
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'serviceVersion',
					displayName: 'Version',
					group: 'Services',
					type: getCustomEnumType(['d2', 'p2']),
					default: 'd2',
					customs: {
						required: 'connection',
						dependsOn(p) {
							return p.useServices ? true : false;
						}
					}
				}),
				getPort({ plug: 'input', name: 'flowData', displayName: 'Flow data', group: 'Data', type: '*' })
			],
			outputs: [
				getPort({ plug: 'output', name: 'executing', displayName: 'Executing', group: 'States', type: 'boolean', default: false }),
				getPort({ plug: 'output', name: 'executed', displayName: 'Executed', group: 'Signals', type: 'signal' }),
				getPort({ plug: 'output', name: 'result', displayName: 'Result', group: 'Data', type: '*' })
			]
		},
	},
	{ color: 'purple' }
);

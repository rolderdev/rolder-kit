import { reactNode } from '@packages/node';
import { getPort } from '@packages/port';
import { lazy } from 'react';

export default reactNode(
	'LocalData',
	{
		'v0.1.0': {
			hashTag: '#expreimental',
			module: {
				dynamic: lazy(() => import('@packages/local-data-v0.1.0'))
			},
			inputs: [
				getPort({
					plug: 'input',
					name: 'dbName',
					displayName: 'DB name',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' }
				}),
				getPort({
					plug: 'input',
					name: 'collectionsDefinition',
					displayName: 'Collections definition',
					group: 'Params',
					type: 'array',
					customs: {
						required: 'connection',
						isObject: true
					}
				}),
				getPort({
					plug: 'input',
					name: 'backendDevMode',
					displayName: 'Dev mode',
					group: 'Params',
					type: 'boolean',
					default: false
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
							return p.backendDevMode ? true : false;
						}
					}
				}),
				getPort({
					plug: 'input',
					name: 'backendPort',
					displayName: 'Port',
					group: 'Params',
					type: 'number',
					default: 7512,
					customs: {
						dependsOn(p) {
							return p.backendDevMode ? true : false;
						}
					}
				})
			]
		}
	},
	{ allowChildren: true }
);

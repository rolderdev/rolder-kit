import { getPort } from '@packages/port';
import { reactNode } from '@packages/node';
import { lazy } from 'react';

const webCameraNode = reactNode(
	'WebCamera',
	{
		'v1.0.0': {
			module: {
				dynamic: lazy(() => import('@packages/web-camera-v1.0.0'))
			},
			inputs: [
				getPort({
					plug: 'input',
					name: 'screenshotEnabled',
					displayName: 'Enable screenshot',
					group: 'Params',
					type: 'boolean',
					default: false
				}),
				getPort({ plug: 'input', name: 'buttonColor', displayName: 'Button color', group: 'Style', type: 'string' })
			],
			outputs: [
				getPort({ plug: 'output', name: 'screenshot', displayName: 'Screenshot', group: 'Data', type: '*' }),
				getPort({ plug: 'output', name: 'screenshoted', displayName: 'Screenshoted', group: 'Signals', type: 'signal' })
			]
		}
	},
	{ allowChildren: true }
);

//===================================================================

Noodl.defineModule({ reactNodes: [webCameraNode] });

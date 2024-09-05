import '@shared/types-v0.1.0';
import { reactNode } from '@shared/node-v1.0.0';
import systemLoaderAnimation from '@shared/system-loader-animation-v0.1.0';

// css loader
import './loader.css';
systemLoaderAnimation.start();

import v200 from '@nodes/app-v2.0.0';

const app = reactNode(
	'App',
	{
		'v2.0.0': v200,
	},
	{ allowChildren: true, docs: '' }
);

Noodl.defineModule({
	name: 'app',
	reactNodes: [app],
	settings: [
		{
			name: 'project',
			type: 'string',
			displayName: 'Project name',
			group: 'Rolder',
			tooltip: 'Examples: rasko, tex',
		},
		{
			name: 'projectVersion',
			type: 'string',
			displayName: 'Project version',
			group: 'Rolder',
		},
		{
			name: 'environment',
			type: {
				name: 'enum',
				enums: [
					{ label: 'd2', value: 'd2' },
					{ label: 't2', value: 't2' },
					{ label: 'p2', value: 'p2' },
				],
			},
			default: 'd2',
			displayName: 'Project environment',
			group: 'Rolder',
		},
		{
			name: 'projectDefaults',
			type: 'array',
			displayName: 'Project defaults',
			group: 'Rolder',
		},
		{
			name: 'stopLoaderAnimationOn',
			type: {
				name: 'enum',
				enums: [
					{ label: 'App initialized', value: 'appInitialized' },
					{ label: 'Data initialized', value: 'dataInitialized' },
					{ label: 'Auth initialized', value: 'authInitialized' },
					{ label: 'Local data initialized', value: 'localDataInitialized' },
				],
			},
			default: 'authInitialized',
			displayName: 'Stop loader animation on',
			group: 'Rolder',
		},
	],
});

import '@shared/types-v0.1.0'
import { reactNode } from '@shared/node-v1.0.0'
import { set } from 'shared/src/libs/just'

import systemLoaderAnimation from '@shared/system-loader-animation-v0.2.0'
import '@shared/system-loader-animation-v0.2.0/loader.css'
systemLoaderAnimation.start()

import v200 from '@nodes/app-v2.0.0'

const app = reactNode(
	'App',
	{
		'v2.0.0': v200,
	},
	{ allowChildren: true, docs: '' }
)

set(
	window,
	['R', 'packages', 'app'],
	[
		{
			name: 'Rolder Kit - App',
			type: '',
			subCategories: [
				{
					name: '',
					items: ['rolder-kit.api-v1.App'],
				},
			],
		},
	]
)

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
	],
})

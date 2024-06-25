const urlParams = new URLSearchParams(window.location.search);
const d = parseInt(urlParams.get('debug') || '0');
import rKitJson from '../../../package.json';

window.R = {
	//@ts-ignore
	states: { backend: 'notInitialized', debug: d, devMode: DEVMODE },
	env: { rolderKit: rKitJson.version },
	params: {},
	libs: {},
	utils: {}
};

import { consola } from 'consola';
switch (d) {
	case 0:
		consola.level = 0;
		break;
	case 1:
		consola.level = 2;
		break;
	case 2:
		consola.level = 3;
		break;
	case 3:
		consola.level = 4;
		break;
}

window.log = {
	start: () => performance.now(),
	end: (title, startTime) => consola.log(title, Math.round(performance.now() - startTime)),
	info: (title, ...args) => consola.info(title, ...args),
	debug: (title, ...args) => consola.debug(title, ...args),
	error: (title, ...args) => {
		consola.error(title, ...args);
		Sentry.captureMessage(`${title} ${JSON.stringify(args)}`);
	},
	sentryMessage: (message) => Sentry.captureMessage(message),
	sentryError: (error) => Sentry.captureException(error)
};

// css loader
import addCssToHtmlHead from '@packages/add-css-to-html-head';
import './loader.css';
addCssToHtmlHead(['app']);
systemLoaderAnimation.start();

// =====================================================
import libs from './libs';
R.libs = libs;
import utils from './utils';
R.utils = utils;
import * as icons from './icons';
R.libs.icons = icons;

// =====================================================
import { getCustomEnumType, getPort } from '@packages/port';
import { reactNode } from '@packages/node';

import v140 from '@packages/app-v1.4.0';
import v200 from '@packages/app-v2.0.0';
import getEnum from '@packages/port/src/funcs/getEnum';
import systemLoaderAnimation from '@packages/system-loader-animation';

Noodl.defineModule({
	reactNodes: [
		reactNode(
			'App',
			{
				'v1.4.0': {
					module: { static: v140 },
					inputs: [
						getPort({
							plug: 'input',
							name: 'colorScheme',
							displayName: 'Color scheme',
							group: 'Style',
							type: getCustomEnumType(['light', 'dark', 'auto']),
							default: 'light',
							customs: { required: 'connection' }
						}),
						getPort({
							plug: 'input',
							name: 'setColorScheme',
							displayName: 'Set color scheme',
							group: 'Signals',
							type: 'signal',
							customs: {
								dependsOn(props) {
									return props.colorScheme === 'auto' ? false : true;
								}
							}
						}),
						getPort({
							plug: 'input',
							name: 'toggleColorScheme',
							displayName: 'Toggle color scheme',
							group: 'Signals',
							type: 'signal',
							customs: {
								dependsOn(props) {
									return props.colorScheme === 'auto' ? false : true;
								}
							}
						})
					],
					outputs: [
						getPort({
							plug: 'output',
							name: 'colorScheme',
							displayName: 'Color scheme',
							group: 'Style',
							type: 'string',
							customs: {
								dependsOn(props) {
									return props.colorScheme === 'auto' ? false : true;
								}
							}
						}),
						getPort({
							plug: 'output',
							name: 'colorSchemeChanged',
							displayName: 'Color scheme changed',
							group: 'Signals',
							type: 'signal',
							customs: {
								dependsOn(props) {
									return props.colorScheme === 'auto' ? false : true;
								}
							}
						})
					]
				},
				'v2.0.0': {
					hashTag: '#expreimental',
					module: { static: v200 },
					inputs: [
						getPort({
							plug: 'input',
							name: 'multiInstance',
							displayName: 'Multi local DB instance',
							group: 'Params',
							type: 'boolean',
							default: true
						}),
						getPort({
							plug: 'input',
							name: 'sentry',
							displayName: 'Enable Sentry logs',
							group: 'Params',
							type: 'boolean',
							default: false
						}),
						getPort({
							plug: 'input',
							name: 'sentryDsn',
							displayName: 'Sentry DSN',
							group: 'Params',
							type: 'string',
							customs: {
								dependsOn(p) {
									return p.sentry ? true : false;
								}
							}
						})
					],
					outputs: [
						getPort({
							plug: 'output',
							name: 'networkType',
							displayName: 'Type',
							group: 'Network',
							type: 'string'
						}),
						getPort({
							plug: 'output',
							name: 'networkConnected',
							displayName: 'Connected',
							group: 'Network',
							type: 'boolean'
						})
					]
				}
			},
			{
				allowChildren: true
			}
		)
	],
	settings: [
		{
			name: 'project',
			type: 'string',
			displayName: 'Project name',
			group: 'Rolder',
			tooltip: 'Examples: rasko, tex'
		},
		{
			name: 'projectVersion',
			type: 'string',
			displayName: 'Project version',
			group: 'Rolder'
		},
		{
			name: 'environment',
			type: {
				name: 'enum',
				enums: getEnum(['d2', 't2', 's2', 'p2'], true)
			},
			default: 'd2',
			displayName: 'Project environment',
			group: 'Rolder'
		},
		{
			name: 'projectDefaults',
			type: 'array',
			displayName: 'Project defaults',
			group: 'Rolder'
		},
		{
			name: 'stopLoaderAnimationOn',
			type: {
				name: 'enum',
				enums: getEnum(['appInitialized', 'dataInitialized', 'authInitialized', 'localDataInitialized'])
			},
			default: 'authInitialized',
			displayName: 'Stop loader animation on',
			group: 'Rolder'
		}
	]
});

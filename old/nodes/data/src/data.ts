import { reactNode } from '@packages/node';
import { getPort } from '@packages/port';
import { lazy } from 'react';

const dataNode = reactNode(
	'Data',
	{
		'v1.0.0': {
			module: { dynamic: lazy(() => import('@packages/data-v1.0.0')) },
			inputs: [
				getPort({
					plug: 'input',
					name: 'backendVersion',
					displayName: 'Backend version',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'dbName',
					displayName: 'DB name',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'persistData',
					displayName: 'Persist data',
					group: 'Params',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'backendDevMode',
					displayName: 'Backend dev mode',
					group: 'Params',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'backendUrl',
					displayName: 'Backend url',
					group: 'Params',
					type: 'string',
					default: 'localhost',
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.backendDevMode ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'backendPort',
					displayName: 'Backend port',
					group: 'Params',
					type: 'number',
					default: 7512,
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.backendDevMode ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'detectOffline',
					displayName: 'Detect offline',
					group: 'Network',
					type: 'boolean',
					default: false,
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'measureTimeout',
					displayName: 'Timeout',
					group: 'Network',
					type: 'number',
					default: 2000,
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.detectOffline;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'offlineLatancy',
					displayName: 'Latancy',
					group: 'Network',
					type: 'number',
					default: 200,
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.detectOffline;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'offlineJitter',
					displayName: 'Jitter',
					group: 'Network',
					type: 'number',
					default: 100,
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.detectOffline;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'offlineDownload',
					displayName: 'Download',
					group: 'Network',
					type: 'number',
					default: 10000,
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.detectOffline;
						},
					},
				}),
			],
			outputs: [
				getPort({ plug: 'output', name: 'isOnline', displayName: 'Online', group: 'States', type: 'boolean' }),
				getPort({ plug: 'output', name: 'network', displayName: 'Network', group: 'States', type: 'object' }),
			],
		},
		'v1.1.0': {
			hashTag: '#deprecated',
			module: { dynamic: lazy(() => import('@packages/data-v1.1.0')) },
			inputs: [
				getPort({
					plug: 'input',
					name: 'dbName',
					displayName: 'DB name',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'backendDevMode',
					displayName: 'Backend dev mode',
					group: 'Params',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'backendUrl',
					displayName: 'Backend url',
					group: 'Params',
					type: 'string',
					default: 'localhost',
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.backendDevMode ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'backendPort',
					displayName: 'Backend port',
					group: 'Params',
					type: 'number',
					default: 7512,
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.backendDevMode ? true : false;
						},
					},
				}),
			],
		},
		'v2.0.0': {
			hashTag: '#pre-release',
			module: { dynamic: lazy(() => import('@packages/data-v2.0.0')) },
			inputs: [
				getPort({
					plug: 'input',
					name: 'dbName',
					displayName: 'DB name',
					group: 'Params',
					type: 'string',
					customs: { required: 'both' },
				}),
				getPort({
					plug: 'input',
					name: 'backendDevMode',
					displayName: 'Backend dev mode',
					group: 'Params',
					type: 'boolean',
					default: false,
				}),
				getPort({
					plug: 'input',
					name: 'backendUrl',
					displayName: 'Backend url',
					group: 'Params',
					type: 'string',
					default: 'localhost',
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.backendDevMode ? true : false;
						},
					},
				}),
				getPort({
					plug: 'input',
					name: 'backendPort',
					displayName: 'Backend port',
					group: 'Params',
					type: 'number',
					default: 7512,
					customs: {
						required: 'both',
						dependsOn(p) {
							return p.backendDevMode ? true : false;
						},
					},
				}),
			],
			outputs: [getPort({ plug: 'output', name: 'initialized', displayName: 'Initialized', group: 'Signals', type: 'signal' })],
		},
	},
	{ allowChildren: true }
);

//===================================================================
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import authNode from '@nodes/auth';
import dataContext from '@nodes/data-context';
import UseDataNode from '@old-nodes/use-data';
import localDataNode from '@nodes/local-data';

const reactNodes = [authNode, dataNode, localDataNode, dataContext, UseDataNode];

import getDataNode from '@nodes/get-data';
import logoutNode from '@nodes/logout';
import noderedNode from '@nodes/nodered';
import saveAsNode from '@nodes/save-as';
import createNode from '@nodes/create';
import updateNode from '@nodes/update';
import updateByQueryNode from '@nodes/update-by-query'; // Vezdexod
import deleteNode from '@nodes/delete';

const nodes = [getDataNode, logoutNode, noderedNode, saveAsNode, createNode, updateNode, updateByQueryNode, deleteNode];

Noodl.defineModule({ reactNodes, nodes: nodes.map((i) => defineNode(i)) });

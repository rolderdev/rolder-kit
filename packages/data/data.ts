import '@shared/types-v0.1.0';
import { set } from 'shared/src/libs/just';
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import item from './src/item';
import node from './src/node';
import create from './src/create';
import update from './src/update';
import deleteN from './src/delete';
//import search from './src/search';
import useData from './src/useData';
import logout from './src/logout';
import nodered from './src/nodered';

const jsPackages = [item, node, create, update, deleteN, useData, logout, nodered];

set(
	window,
	['R', 'packages', 'data'],
	[
		{
			name: 'Rolder Kit - Data',
			type: '',
			subCategories: [
				{
					name: 'Data',
					items: [
						'rolder-kit.api-v1.useData',
						'rolder-kit.api-v1.create',
						'rolder-kit.api-v1.update',
						'rolder-kit.api-v1.delete',
						//'rolder-kit.api-v1.saveAs',
					],
				},
				{
					name: 'Auth',
					items: ['rolder-kit.api-v1.logout'],
				},
				/* {
					name: 'Integration',
					items: ['rolder-kit.api-v1.nodered'],
				}, */
			],
		},
	]
);

Noodl.defineModule({ name: 'data', nodes: jsPackages.map(defineNode) });

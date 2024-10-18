import '@shared/types-v0.1.0'
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk'
import { set } from 'shared/src/libs/just'

import create from './src/create'
import deleteN from './src/delete'
import item from './src/item'
import logout from './src/logout'
import node from './src/node'
import nodered from './src/nodered'
import update from './src/update'
//import search from './src/search';
import useData from './src/useData'

const jsPackages = [item, node, create, update, deleteN, useData, logout, nodered]

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
)

Noodl.defineModule({ name: 'data', nodes: jsPackages.map(defineNode) })

import '@shared/types-v0.1.0';
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import item from './src/item';
import node from './src/node';
import create from './src/create';
import update from './src/update';
import deleteN from './src/delete';
import search from './src/search';
import useData from './src/useData';
import logout from './src/logout';
import nodered from './src/nodered';

const jsPackages = [item, node, create, update, deleteN, search, useData, logout, nodered];

Noodl.defineModule({ name: 'data', nodes: jsPackages.map(defineNode) });

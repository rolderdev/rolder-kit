import '@shared/types-v0.1.0';
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import data from './src/data';
import auth from './src/auth';
import item from './src/item';
import node from './src/node';
import search from './src/search';
import useData from './src/useData';

const reactPackages = [data, auth];
const jsPackages = [item, node, search, useData];

Noodl.defineModule({ name: 'data', reactNodes: reactPackages, nodes: jsPackages.map((i) => defineNode(i)) });

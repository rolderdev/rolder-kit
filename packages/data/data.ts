import '@shared/types-v0.1.0';
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import item from './src/item';
import search from './src/search';
import useData from './src/useData';

const jsPackages = [item, search, useData];

Noodl.defineModule({ nodes: jsPackages.map((i) => defineNode(i)) });

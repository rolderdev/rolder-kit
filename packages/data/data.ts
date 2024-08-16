import '@shared/types-v0.1.0';
import { defineNode } from '@noodl/noodl-sdk';

import search from './src/search';
import useData from './src/useData';

const jsPackages = [search, useData];

Noodl.defineModule({ nodes: jsPackages.map((i) => defineNode(i) as any) });

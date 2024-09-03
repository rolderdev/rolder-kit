//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import mantine from './src/mantine';
// dataDispaly
import table from './dataDisplay/table';
// feedback
import notification from './feedback/notification';
// lyaout
import stack from './layout/stack';
// overlays
import tooltip from './overlays/tooltip';
// typography
import text from './typography/text';

const reactPackages = [mantine, table, stack, tooltip, text];
const jsPackages = [notification];

Noodl.defineModule({ name: 'mantine', reactNodes: reactPackages, nodes: jsPackages.map((i) => defineNode(i)) });

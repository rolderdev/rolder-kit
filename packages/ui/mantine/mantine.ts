// Используется только на уровне Roodl.
import set from 'just-safe-set';
//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form';
set(window, ['R', 'libs', 'form'], { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField });

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

Noodl.defineModule({ reactNodes: reactPackages, nodes: jsPackages.map((i) => defineNode(i)) });

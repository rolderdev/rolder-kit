//@ts-ignore
import { defineNode } from '@noodl/noodl-sdk';

import mantine from './src/mantine';
// dataDispaly
import table from './dataDisplay/table';
import tableFilter from './dataDisplay/modules/tableFilter';
// feedback
import notification from './feedback/notification';
// inputs
import numberInput from './inputs/numberInput';
// lyaout
import stack from './layout/stack';
// miscellaneous
import richText from './miscellaneous/richText';
import transition from './miscellaneous/transition';
// navigation
import anchor from './navigation/anchor';
// overlays
import tooltip from './overlays/tooltip';
// typography
import text from './typography/text';

const reactPackages = [mantine, table, numberInput, stack, richText, transition, anchor, tooltip, text];
const jsPackages = [notification, tableFilter];

Noodl.defineModule({ name: 'mantine', reactNodes: reactPackages, nodes: jsPackages.map(defineNode) });

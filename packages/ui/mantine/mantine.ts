// Используется только на уровне Roodl.
import set from 'just-safe-set';
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form';
set(window, ['R', 'libs', 'form'], { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField });

import mantine from './src/mantine';
// dataDispaly
import table from './dataDisplay/table';
// lyaout
import stack from './layout/stack';
// overlays
import tooltip from './overlays/tooltip';
// typography
import text from './typography/text';

const reactPackages = [mantine, table, stack, tooltip, text];

Noodl.defineModule({ reactNodes: reactPackages });

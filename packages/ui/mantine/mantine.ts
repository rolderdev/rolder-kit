import '@shared/types-v0.1.0';

// Используется только на уровне Roodl.
import set from 'just-safe-set';
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form';
set(window, ['R', 'libs', 'form'], { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField });

import mantine from './src/mantine';
// lyaout
import stack from './layout/stack';
// typography
import text from './typography/text';

const reactPackages = [mantine, stack, text];

Noodl.defineModule({ reactNodes: reactPackages });

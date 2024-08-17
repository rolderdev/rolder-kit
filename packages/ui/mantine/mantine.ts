import '@shared/types-v0.1.0';

import mantine from './src/mantine';
// lyaout
import stack from './layout/stack';
// typography
import text from './typography/text';

const reactPackages = [mantine, stack, text];

Noodl.defineModule({ reactNodes: reactPackages });

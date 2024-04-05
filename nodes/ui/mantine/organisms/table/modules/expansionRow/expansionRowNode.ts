import { reactNode } from '@shared/node'

import v100 from '@shared/expansion-row-v1.0.0'
import v110 from '@shared/expansion-row-v1.1.0'

export default reactNode('ExpansionRow', {
    'v1.0.0': {
        module: { static: v100 }
    },
    'v1.1.0': {
        module: { static: v110 }
    }
}, {  allowChildren: true })
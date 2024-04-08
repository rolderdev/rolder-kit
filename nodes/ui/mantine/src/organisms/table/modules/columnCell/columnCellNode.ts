import { reactNode } from '@packages/node'
import { getPorts } from '@packages/port'

import v100 from '@packages/column-cell-v1.0.0'

export default reactNode('ColumnCell', {
    'v1.0.0': {
        module: { static: v100 },
        inputs: getPorts('input', ['table2ColumnIndex', 'table2Controlled']),
    }
}, {  allowChildren: true })
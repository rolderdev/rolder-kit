import { reactNode } from '@shared/node'
import { getPorts } from '@shared/port'

import v100 from '@shared/column-cell-v1.0.0'

export default reactNode('ColumnCell', {
    'v1.0.0': {
        module: { static: v100 },
        inputs: getPorts('input', ['table2ColumnIndex', 'table2Controlled']),
    }
}, {  allowChildren: true })
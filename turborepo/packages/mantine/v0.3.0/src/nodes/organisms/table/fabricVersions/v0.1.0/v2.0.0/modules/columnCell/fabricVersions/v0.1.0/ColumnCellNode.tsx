import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_1_0 from './v0.1.0/ColumnCell'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        hashTag: 'experimental',
        Comp: v0_1_0,
        inputs: getPorts('input', ['table2ColumnIndex', 'table2Controlled'], ['table2ColumnIndex']),
    },
}

//===================================================================

export default getReactNode('ColumnCell', compVersions, true)
import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_1_0 from './v0.1.0/ColumnFilter'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: getPorts('input', ['table2ColumnIndex', 'table2FilterValue'], ['table2ColumnIndex']),
        outputs: getPorts('output', ['table2FilterValue']),
        signals: getPorts('input', ['table2SetFilterValue', 'table2Filter', 'close', 'reset'])
    },
}

//===================================================================

export default getReactNode('ColumnFilter', compVersions, true)
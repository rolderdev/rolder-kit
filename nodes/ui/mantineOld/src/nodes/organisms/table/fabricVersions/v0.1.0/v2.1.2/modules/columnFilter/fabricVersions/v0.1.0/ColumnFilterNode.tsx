import { getReactNode } from '../../../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'
import v0_1_0 from './v0.1.0/ColumnFilter'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        hashTag: 'experimental',
        Comp: v0_1_0,
        inputs: getPorts('input', ['table2ColumnIndex', 'table2FilterValue'], ['table2ColumnIndex']),
        outputs: getPorts('output', ['table2FilterValue']),
        signals: getPorts('input', ['table2SetFilterValue', 'table2Filter', 'close', 'reset'])
    },
}

//===================================================================

export default getReactNode('ColumnFilter', compVersions, true)
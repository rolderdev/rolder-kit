import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/Header'
import v0_1_1 from './v0.1.1/Header'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [...getPorts('input', ['headerWithBorder', 'headerHeight', 'burgerSize'])]
    },
    'v0.1.1': {
        Comp: v0_1_1,
        inputs: [...getPorts('input', ['headerWithBorder', 'headerHeight', 'burgerSize'])]
    }
}

//===================================================================

export default getReactNode('Header', compVersions, true)
import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/Plot'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: getPorts('input', ['plotFunc', 'items'])
    }
}

//===================================================================

export default getReactNode('Plot', compVersions)
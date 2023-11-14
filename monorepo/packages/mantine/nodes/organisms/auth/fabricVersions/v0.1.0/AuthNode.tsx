import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_4_0 from './v0.4.0/Auth'

//===================================================================

const compVersions: CompVersions = {
    'v0.4.0': {
        Comp: v0_4_0,
        inputs: [...getPorts('input', ['paddings', 'p', 'w', 'h', 'shadow', 'stackSpacing', 'buttonColor'])],
        outputs: [...getPorts('output', ['authenticated', 'userRole'])]
    }
}

//===================================================================

export default getReactNode('Auth', compVersions)
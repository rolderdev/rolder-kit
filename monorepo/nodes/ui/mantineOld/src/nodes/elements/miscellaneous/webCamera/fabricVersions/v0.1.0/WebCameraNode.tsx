import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/WebCamera'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['screenshotEnabled', 'buttonColor']),
        outputs: getPorts('output', ['screenshot', 'screenshoted'])
    }
}

//===================================================================

export default getReactNode('WebCamera', compVersions)
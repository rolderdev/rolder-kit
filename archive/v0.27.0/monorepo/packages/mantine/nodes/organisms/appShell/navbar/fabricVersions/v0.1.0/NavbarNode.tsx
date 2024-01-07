import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/Navbar'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getPorts('input',
                ['navbarWithBorder', 'navbarWidth', 'navbarRespHide', 'navbarHiddenBreakpoint', 'navbarOffsetBreakpoint']),
            ...getGroupedPorts('input', ['Paddings'])
        ]
    }
}

//===================================================================

export default getReactNode('Navbar', compVersions, true)
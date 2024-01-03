import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

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
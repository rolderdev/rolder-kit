import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_1_0 from './v0.1.0/NavbarSection'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [...getPorts('input', ['grow']), ...getGroupedPorts('input', ['Margins'])]
    }
}

//===================================================================

export default getReactNode('NavbarSection', compVersions, true)
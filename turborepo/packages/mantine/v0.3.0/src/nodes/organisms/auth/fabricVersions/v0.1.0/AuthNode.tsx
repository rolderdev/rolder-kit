import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'

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
import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_2_0 from './v0.2.0/Paper'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins', 'Paddings']),
            ...getPorts('input', ['opacity', 'shadow', 'radius', 'withBorder'])
        ]
    }
}

//===================================================================

export default getReactNode('Paper', compVersions, true)
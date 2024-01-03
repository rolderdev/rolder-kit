import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_3_0 from './v0.3.0/Group'

//===================================================================

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins', 'Paddings']),
            ...getPorts('input', ['groupPosition', 'groupSpacing', 'grow', 'w', 'h', 'opacity'])
        ]
    }
}

//===================================================================

export default getReactNode('Group', compVersions, true)
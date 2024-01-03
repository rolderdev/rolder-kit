import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_2_0 from './v0.2.0/Stack'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins', 'Paddings']),
            ...getPorts('input', ['stackAlign', 'stackJustify', 'stackSpacing', 'w', 'h', 'opacity'])
        ]
    }
}

//===================================================================

export default getReactNode('Stack', compVersions, true)
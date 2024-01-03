import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_1_0 from './v0.1.0/Flex'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins', 'Paddings']),
            ...getPorts('input', ['gap', 'rowGap', 'columnGap', 'flexJustify', 'flexAlign', 'flexDirection', 'flexWrap', 'w', 'h', 'opacity'])
        ]
    }
}

//===================================================================

export default getReactNode('Flex', compVersions, true)
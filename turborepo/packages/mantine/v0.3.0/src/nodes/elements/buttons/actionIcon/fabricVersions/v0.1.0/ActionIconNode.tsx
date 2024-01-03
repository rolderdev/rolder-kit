import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_3_0 from './v0.3.0/ActionIcon'
import v0_3_1 from './v0.3.1/ActionIcon'

//===================================================================

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getGroupedPorts('input', ['Icon', 'Margins']),
            ...getPorts('input', ['disabled', 'size', 'radius', 'color', 'actionIconVariant', 'loading'])
        ],
        outputs: getPorts('output', ['clicked'])
    },
    'v0.3.1': {
        Comp: v0_3_1,
        inputs: [
            ...getGroupedPorts('input', ['Icon', 'Margins']),
            ...getPorts('input', ['disabled', 'size', 'radius', 'color', 'actionIconVariant', 'loading'])
        ],
        outputs: getPorts('output', ['clicked'])
    }
}

//===================================================================

export default getReactNode('ActionIcon', compVersions)
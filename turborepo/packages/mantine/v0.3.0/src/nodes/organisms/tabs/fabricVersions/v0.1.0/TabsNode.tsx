import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_1_0 from './v0.1.0/Tabs'
import v0_2_0 from './v0.2.0/Tabs'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        hashTag: 'deprecated',
        Comp: v0_1_0,
        inputs: getPorts('input', ['value', 'tabsVariant', 'radius', 'color', 'tabsPosition', 'grow', 'unstyled', 'tabsOrientation'])
    },
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [...getPorts('input',
            ['value', 'tabsVariant', 'radius', 'color', 'tabsPosition', 'grow', 'unstyled', 'tabsOrientation', 'h', 'w']),
        ...getGroupedPorts('input', ['Margins', 'Paddings'])
        ]
    }
}

//===================================================================

export default getReactNode('Tabs', compVersions, true)
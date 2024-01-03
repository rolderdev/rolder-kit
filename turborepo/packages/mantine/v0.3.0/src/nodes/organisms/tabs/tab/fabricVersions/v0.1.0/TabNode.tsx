import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_1_0 from './v0.1.0/Tab'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [...getPorts('input', ['label', 'value', 'color', 'disabled'], ['value']), ...getGroupedPorts('input', ['Icon'])],
        outputs: getPorts('output', ['clicked'])
    }
}

//===================================================================

export default getReactNode('Tab', compVersions, true)
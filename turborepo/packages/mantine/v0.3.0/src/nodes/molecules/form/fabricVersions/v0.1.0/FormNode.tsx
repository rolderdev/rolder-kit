import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_4_0 from './v0.4.0/Form'

//===================================================================

const compVersions: CompVersions = {
    'v0.4.0': {
        Comp: v0_4_0,
        inputs: getPorts('input', ['formScheme']),
        outputs: getPorts('output', ['formHook', 'submited']),
    }
}

//===================================================================

export default getReactNode('Form', compVersions, true)
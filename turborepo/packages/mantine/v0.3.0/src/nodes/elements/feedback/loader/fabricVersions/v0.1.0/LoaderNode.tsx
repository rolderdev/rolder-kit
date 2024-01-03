import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_2_0 from './v0.2.0/Loader'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['color', 'size', 'loaderVariant'])
    }
}

//===================================================================

export default getReactNode('Loader', compVersions)
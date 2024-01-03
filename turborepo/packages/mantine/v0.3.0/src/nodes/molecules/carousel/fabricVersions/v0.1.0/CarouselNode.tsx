import { CompVersions, getReactNode } from '@rk/node-fabrik'

import v0_2_0 from './v0.2.0/Carousel'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
    }
}

//===================================================================

export default getReactNode('Carousel', compVersions, true)
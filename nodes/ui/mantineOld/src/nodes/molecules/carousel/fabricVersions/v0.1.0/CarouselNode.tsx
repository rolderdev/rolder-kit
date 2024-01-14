import { getReactNode } from '../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'

import v0_2_0 from './v0.2.0/Carousel'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
    }
}

//===================================================================

export default getReactNode('Carousel', compVersions, true)
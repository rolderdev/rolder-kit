import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_10_0 from './v0.10.0/UseData'
import v0_11_0 from './v0.11.0/UseData'

//===================================================================

const compVersions: CompVersions = {
    'v0.10.0': {
        Comp: v0_10_0,
        inputs: getPorts('input', ['dbClass', 'filters', 'sorts', 'options', 'refs', 'backRefs',
            'searchEnabled', 'searchString', 'searchScheme', 'getUsers'],
            ['dbClass', 'searchScheme']),
        outputs: getPorts('output', ['items', 'fetched', 'founded', 'pending', 'fetching', 'searching']),
        signals: getPorts('input', ['refetch'])
    },
    'v0.11.0': {
        Comp: v0_11_0,
        inputs: getPorts('input', ['dbClasses', 'useDataScheme', 'searchString'], ['dbClasses']),
        outputs: getPorts('output', ['fetched', 'founded', 'pending', 'fetching']),
    }
}

//===================================================================

export default getReactNode('UseData', compVersions, false, 'data', true)
import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_3_0 from './v0.3.0/Button'

//===================================================================

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getGroupedPorts('input', ['Icon', 'Margins']),
            ...getPorts('input', ['label', 'disabled', 'size', 'radius', 'color', 'buttonVariant', 'loading', 'buttonType'])
        ],
        outputs: getPorts('output', ['clicked'])
    }
}

//===================================================================

export default getReactNode('Button', compVersions)
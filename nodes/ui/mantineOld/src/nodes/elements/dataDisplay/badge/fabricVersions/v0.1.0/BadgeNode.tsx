import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/Badge'
import v0_3_0 from './v0.3.0/Badge'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins']),
            ...getPorts('input', ['badgeVariant', 'size', 'radius', 'color', 'label', 'gradient', 'fullWidth', 'w'])
        ]
    },
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins']),
            ...getPorts('input', ['badgeVariant', 'size', 'radius', 'color', 'label', 'gradient', 'fullWidth', 'w', 'useScope', 'scope',])
        ]
    }
}

//===================================================================

export default getReactNode('Badge', compVersions)
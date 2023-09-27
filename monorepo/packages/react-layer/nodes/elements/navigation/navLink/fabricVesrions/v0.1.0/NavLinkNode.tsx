import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/NavLink'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getPorts('input', ['active', 'label', 'color', 'description', 'navLinkVariant', 'activateLabel']),
            ...getGroupedPorts('input', ['Icon'])
        ],
        outputs: [...getPorts('output', ['clicked'])]
    }
}

//===================================================================

export default getReactNode('NavLink', compVersions, true)
import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/Grid'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins', 'Paddings']),
            ...getPorts('input',
                ['opacity', 'w', 'h', 'gutter', 'grow', 'gridColumnsCount', 'gridJustify', 'gridAlign', 'gridColumnsScheme'],
                ['gridColumnsScheme'])
        ]
    }
}

//===================================================================

export default getReactNode('Grid', compVersions, true)
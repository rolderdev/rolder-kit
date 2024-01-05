import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/Grid'
import v0_3_0 from './v0.3.0/Grid'
import v0_3_1 from './v0.3.1/Grid'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        hashTag: 'deprecated',
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins', 'Paddings']),
            ...getPorts('input',
                ['opacity', 'w', 'h', 'gutter', 'grow', 'gridColumnsCount', 'gridJustify', 'gridAlign', 'gridColumnsScheme'],
                ['gridColumnsScheme'])
        ]
    },
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins', 'Paddings']),
            ...getPorts('input',
                ['opacity', 'w', 'h', 'gutter', 'grow', 'gridColumnsCount', 'gridJustify', 'gridAlign', 'gridColumnsScheme',
                    'childIsRepeater'],
                ['gridColumnsScheme'])
        ]
    },
    'v0.3.1': {
        Comp: v0_3_1,
        inputs: [
            ...getGroupedPorts('input', ['Margins', 'Paddings']),
            ...getPorts('input',
                ['opacity', 'w', 'h', 'gutter', 'grow', 'gridColumnsCount', 'gridJustify', 'gridAlign', 'gridColumnsScheme',
                    'childIsRepeater'],
                ['gridColumnsScheme'])
        ]
    }
}

//===================================================================

export default getReactNode('Grid', compVersions, true)
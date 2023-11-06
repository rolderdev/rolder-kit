import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/Title'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['titleOrder', 'color', 'w', 'h', 'opacity', 'inline', 'fitContent', 'ta',
            'textFormat', 'textMask', 'numberFormat', 'dateFormatAtText', 'dataSource', 'itemSource', 'sourceField', 'valueSource'])
    }
}

//===================================================================

export default getReactNode('Title', compVersions)
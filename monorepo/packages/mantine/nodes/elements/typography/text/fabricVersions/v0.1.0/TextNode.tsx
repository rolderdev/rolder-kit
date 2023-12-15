import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_5_0 from './v0.5.0/Text'
import v0_6_0 from './v0.6.0/Text'

//===================================================================

const compVersions: CompVersions = {
    'v0.5.0': {
        Comp: v0_5_0,
        inputs: getPorts('input', ['fz', 'fw', 'color', 'w', 'h', 'opacity', 'inline', 'fitContent', 'ta',
            'textFormat', 'textMask', 'numberFormat', 'dateFormatAtText', 'dataSource', 'itemSource', 'sourceField', 'valueSource'])
    },
    'v0.6.0': {
        Comp: v0_6_0,
        inputs: getPorts('input', ['fz', 'fw', 'color', 'w', 'h', 'opacity', 'inline', 'fitContent', 'ta',
            'textFormat', 'textMask', 'numberFormat', 'dateFormatAtText', 'dataSource2', 'itemSource2', 'sourceField2', 'valueSource2'])
    }
}

//===================================================================

export default getReactNode('Text', compVersions, false)
import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/Highlight'

//===================================================================

const compVersions: CompVersions = {    
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: getPorts('input', [
            'fz', 'fw', 'color', 'w', 'h', 'opacity', 'inline', 'fitContent', 'ta', 'textFormat', 'textMask', 'numberFormat',
            'dateFormatAtText', 'dataSource', 'itemSource', 'sourceField', 'valueSource', 'useScope', 'scope', 
            'highlight',  'highlightColor','highlightStyles'
        ])
    }
}

//===================================================================

export default getReactNode('Highlight', compVersions, false)
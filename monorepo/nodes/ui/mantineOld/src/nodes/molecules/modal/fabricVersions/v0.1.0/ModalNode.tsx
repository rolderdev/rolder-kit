import { getReactNode } from '../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_3_0 from './v0.3.0/Modal'

//===================================================================

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: getPorts('input', ['sizePresets', 'sizeUnits', 'modalHeaderEnabled', 'modalTitle', 'closeActionEnabled',
            'modalOpacity', 'modalBlur', 'modalTitleOrder', 'trapFocus', 'returnFocus', 'fullScreen', 'closeOnEscape', 'closeOnClickOutside']),
        outputs: getPorts('output', ['closed']),
        signals: getPorts('input', ['open', 'close'])
    }
}

//===================================================================

export default getReactNode('Modal', compVersions, true)
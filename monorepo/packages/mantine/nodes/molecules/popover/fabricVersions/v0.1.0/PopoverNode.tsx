import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/Popover'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts('input', ['Icon', 'Margins']),
            ...getPorts('input', ['popoverTarget', 'disabled', 'size', 'radius', 'color', 'popoverActionIconVariant', 'loading',
                'popoverButtonLabel', 'popoverButtonVariant', 'withArrow', 'shadow', 'popoverPosition'])
        ],
        signals: getPorts('input', ['close'])
    }
}

//===================================================================

export default getReactNode('Popover', compVersions, true)
import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

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
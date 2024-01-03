import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_2_0 from './v0.2.0/Indicator'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', [
            'color', 'sizeUnits', 'indicatorPosition', 'radius', 'indicatorProcessing', 'withBorder', 'disabled', 'inline', 'label'
        ])
    }
}

//===================================================================

export default getReactNode('Indicator', compVersions, true)
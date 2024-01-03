import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/Divider'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getGroupedPorts('input', ['Margins']),
            ...getPorts('input', ['dividerVariant', 'size', 'dividerOrientation', 'label', 'dividerLabelPosition'])
        ]
    }
}

//===================================================================

export default getReactNode('Divider', compVersions)
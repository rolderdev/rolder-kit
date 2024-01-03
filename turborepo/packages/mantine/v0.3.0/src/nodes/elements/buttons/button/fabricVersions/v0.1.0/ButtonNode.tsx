
import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_3_0 from './v0.3.0/Button'

//===================================================================

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getGroupedPorts('input', ['Icon', 'Margins']),
            ...getPorts('input', ['label', 'disabled', 'size', 'radius', 'color', 'buttonVariant', 'loading', 'buttonType'])
        ],
        outputs: getPorts('output', ['clicked'])
    }
}

//===================================================================

export default getReactNode('Button', compVersions)
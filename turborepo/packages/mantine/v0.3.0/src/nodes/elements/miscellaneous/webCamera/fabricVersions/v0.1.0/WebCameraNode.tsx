import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/WebCamera'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['screenshotEnabled', 'buttonColor']),
        outputs: getPorts('output', ['screenshot', 'screenshoted'])
    }
}

//===================================================================

export default getReactNode('WebCamera', compVersions)
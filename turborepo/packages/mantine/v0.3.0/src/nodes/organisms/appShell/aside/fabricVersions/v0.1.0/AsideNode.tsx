import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_1_0 from './v0.1.0/Aside'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getPorts('input', ['asideWithBorder', 'asideWidth', 'asideRespHide', 'asideHiddenBreakpoint', 'asideOffsetBreakpoint'])]
    }
}


//===================================================================

export default getReactNode('Aside', compVersions, true)
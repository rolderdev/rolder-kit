import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/ScrollArea'
import v0_3_0 from './v0.3.0/ScrollArea'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['w', 'scrollAreaBottomOffset', 'offsetScrollbars', 'opacity'])
    },
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: getPorts('input', ['w', 'scrollAreaBottomOffset', 'offsetScrollbars', 'opacity', 'scrollToMultiplier', 'scrollBehavior']),
        signals: getPorts('input', ['scroll'])
    }
}

//===================================================================

export default getReactNode('ScrollArea', compVersions, true)
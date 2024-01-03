import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_1_0 from './v0.1.0/ListLazy'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getPorts('input', ['listScheme', 'size', 'listType', 'withPadding'], ['listScheme']),
            ...getGroupedPorts('input', ['Embedded icon']),
        ]
    }
}

//===================================================================

export default getReactNode('List', compVersions, true)
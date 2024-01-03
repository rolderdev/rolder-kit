
import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/BarLoader'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['loading', 'loaderColor', 'barLoaderWidth', 'zIndex'])
    }
}

//===================================================================

export default getReactNode('BarLoader', compVersions)
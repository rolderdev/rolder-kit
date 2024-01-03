import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/QRScanner'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['maxScansPerSecond']),
        outputs: getPorts('output', ['qrScanned', 'qrString'])
    }
}

//===================================================================

export default getReactNode('QRScanner', compVersions)
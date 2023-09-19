import { getJsNode } from '../../../../../main/getNodes/v0.4.0/getNode'
import { JsVersions } from '../../../../../main/getNodes/v0.5.0/types'
import { getPorts } from '../../../../../main/ports/v0.3.0/get'

const jsVersions: JsVersions = {
    'v0.1.0': {
        signals: import('./v0.1.0/sUpdate'),
        inputs: [...getPorts({ type: 'input', portNames: ['updateScheme', 'update'] })],
        outputs: [...getPorts({ type: 'output', portNames: ['updatedData', 'updated', 'updating'] })],
    },
    'v0.2.0': {
        signals: import('./v0.2.0/sUpdate'),
        inputs: [...getPorts({ type: 'input', portNames: ['updateScheme', 'update', 'optimistic'] })],
        outputs: [...getPorts({ type: 'output', portNames: ['updatedData', 'updated', 'updating'] })],
    }
}

const nodeName = 'sUpdate'
const nodeVersion = 'v0'
export default getJsNode({ nodeName, nodeVersion, jsVersions, color: 'green' })
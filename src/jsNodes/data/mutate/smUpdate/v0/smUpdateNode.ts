import { getJsNode } from '../../../../../main/getNodes/v0.4.0/getNode'
import { getPorts } from '../../../../../main/ports/v0.3.0/get'

const jsVersions: JsVersions2 = {
    'v0.1.0': {
        signals: import('./v0.1.0/smUpdate'),
        inputs: [...getPorts({ type: 'input', portsNames: ['updateScheme', 'update', 'optimistic'] })],
        outputs: [...getPorts({ type: 'output', portsNames: ['updatedData', 'updated', 'updating'] })],
    }
}

const nodeName = 'smUpdate'
const nodeVersion = 'v0'
export default getJsNode({ nodeName, nodeVersion, jsVersions, color: 'green' })
import { getJsNode } from '../../../../../main/getNodes/v0.4.0/getNode'
import { getPorts } from '../../../../../main/ports/v0.3.0/get'

const jsVersions: JsVersions2 = {
    'v0.2.0': {
        signals: import('./v0.2.0/update'),
        inputs: [...getPorts({ type: 'input', portsNames: ['update', 'updateItem', 'optimistic'] })],
        outputs: [...getPorts({ type: 'output', portsNames: ['updatedItem', 'updated', 'updating'] })],
    }
}

const nodeName = 'update'
const nodeVersion = 'v0'
export default getJsNode({ nodeName, nodeVersion, jsVersions, color: 'green' })
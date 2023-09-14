import { getJsNode } from '../../../../../main/getNodes/v0.4.0/getNode';
import { getPorts } from '../../../../../main/ports/v0.3.0/get'

const jsVersions: JsVersions2 = {
    'v0.1.0': {
        signals: import('./v0.1.0/sCreate'),
        inputs: [...getPorts({ type: 'input', portsNames: ['createScheme', 'create'] })],
        outputs: [...getPorts({ type: 'output', portsNames: ['createdData', 'created', 'creating'] })],
    },
    'v0.2.0': {
        signals: import('./v0.2.0/sCreate'),
        inputs: [...getPorts({ type: 'input', portsNames: ['createScheme', 'create'] })],
        outputs: [...getPorts({ type: 'output', portsNames: ['createdData', 'created', 'creating'] })],
    },
}

const nodeName = 'sCreate'
const nodeVersion = 'v0'
export default getJsNode({ nodeName, nodeVersion, jsVersions, color: 'green' })
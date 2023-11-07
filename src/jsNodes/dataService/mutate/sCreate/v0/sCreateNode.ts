import { getJsNode } from '../../../../../main/getNodes/v0.4.0/getNode';
import { JsVersions } from '../../../../../main/getNodes/v0.5.0/types';
import { getPorts } from '../../../../../main/ports/v0.3.0/get'

const jsVersions: JsVersions = {
    'v0.1.0': {
        signals: import('./v0.1.0/sCreate'),
        inputs: [...getPorts({ type: 'input', portNames: ['createScheme', 'create'] })],
        outputs: [...getPorts({ type: 'output', portNames: ['createdData', 'created', 'creating'] })],
    },
    'v0.2.0': {
        signals: import('./v0.2.0/sCreate'),
        inputs: [...getPorts({ type: 'input', portNames: ['createScheme', 'create'] })],
        outputs: [...getPorts({ type: 'output', portNames: ['createdData', 'created', 'creating'] })],
    },
}

const nodeName = 'sCreate'
const nodeVersion = 'v0'
export default getJsNode({ nodeName, nodeVersion, jsVersions, color: 'green' })
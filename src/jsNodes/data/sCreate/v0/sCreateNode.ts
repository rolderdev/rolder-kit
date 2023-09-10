import { getJsNode } from '../../../../main/getNodes/v0.3.0/getNode';
import { getPorts } from '../../../../main/ports/v0.2.0/ports';

const jsVersions: JsVersions = {
    'v0.1.0': {
        signals: import('./v0.1.0/sCreate'),
        inputs: [...getPorts({ type: 'input', portsNames: ['createScheme', 'create'] })],
        outputs: [...getPorts({ type: 'output', portsNames: ['createdData', 'created', 'creating'] })],
    }
}

const nodeName = 'sCreate'
const nodeVersion = 'v0'
export default getJsNode({ nodeName, nodeVersion, jsVersions })
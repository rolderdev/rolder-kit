import { getJsNode } from '../../../../main/getNodes/v0.4.0/getNode'
import { getPorts } from '../../../../main/ports/v0.3.0/get'

const jsVersions: JsVersions2 = {
    'v0.3.0': {
        signals: import('./v0.3.0/initBackend'),
        inputs: [...getPorts({ type: 'input', portNames: ['init'] })],
        outputs: [...getPorts({ type: 'output', portNames: ['inited', 'jwtValidationFailed', 'jwtValidationSucceed', 'userRole'] })],
    }
}

const nodeName = 'initBackend'
const nodeVersion = 'v0'
export default getJsNode({ nodeName, nodeVersion, jsVersions, color: 'green' })
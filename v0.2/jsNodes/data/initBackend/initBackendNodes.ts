import { getJsNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { jsPorts } from "../../../main/ports/v0.1.0/ports"

const { initBackend, jwtValidationFailed, jwtValidationSucceed } = jsPorts.Signals

const nodeName = 'initBackend'
const nodeVersions = {
    '0.2.0': {
        nodeImport: import('./v0.2.0/initBackend'),
        inputs: { initBackend },
        outputs: { jwtValidationFailed, jwtValidationSucceed },
    }
}

const initBackendNodes = getJsNodes(nodeName, nodeVersions)

export default initBackendNodes
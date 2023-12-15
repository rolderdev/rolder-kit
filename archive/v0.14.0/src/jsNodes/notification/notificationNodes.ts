import { getJsNodes } from '../../main/getNodes/v0.1.0/getNodes'
import { reactPorts } from '../../main/ports/v0.1.0/ports'

const { title, message } = reactPorts.Data
const { autoClose } = reactPorts.Params
const { color } = reactPorts.Style

const nodeName = 'notification'
const nodeVersions: JsNode = {
    '0.1.0': {
        nodeImport: import('./v0.1.0/notification'),
        inputs: { title, message, autoClose, color },
    }
}

const notificationNodes = getJsNodes(nodeName, nodeVersions)

export default notificationNodes
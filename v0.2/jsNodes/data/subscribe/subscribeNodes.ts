import { getJsNodes } from "../../../main/getNodes/v0.1.0/getNodes"

const nodeName = 'subscribe'
const nodeVersions = {
    '0.2.0': {
        nodeImport: import('./v0.2.0/subscribe'),
    }
}

const subscribeNodes = getJsNodes(nodeName, nodeVersions)

export default subscribeNodes
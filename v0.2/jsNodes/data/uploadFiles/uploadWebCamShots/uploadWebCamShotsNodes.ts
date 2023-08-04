import { getJsNodes } from '../../../../main/getNodes/v0.1.0/getNodes'
import { reactPorts } from '../../../../main/ports/v0.1.0/ports'

const { uploadItems, uploadFolder, uploadedUrls } = reactPorts.Data
const { uploading } = reactPorts.States
const { uploaded } = reactPorts.Signals

const nodeName = 'uploadWebCamShots'
const nodeVersions: JsNode = {
    '0.1.0': {
        nodeImport: import('./v0.1.0/uploadWebCamShots'),
        inputs: { uploadItems, uploadFolder },
        outputs: { uploading, uploaded, uploadedUrls }
    }
}

const uploadWebCamShotsNodes = getJsNodes(nodeName, nodeVersions)

export default uploadWebCamShotsNodes
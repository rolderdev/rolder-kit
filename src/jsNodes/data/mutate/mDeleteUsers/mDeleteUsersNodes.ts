import { getJsNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { jsPorts } from "../../../../main/ports/v0.1.0/ports"

const { deleteUserIds } = jsPorts.Data
const { deleting } = jsPorts.States
const { deleted } = jsPorts.Signals

const nodeName = 'mDeleteUsers'
const nodeVersions: JsNode = {
    '0': {
        nodeImport: import('./v0.1.0/mDeleteUsers'),
        inputs: { deleteUserIds },
        outputs: { deleting, deleted }
    }
}

const mDeleteUsersNodes = getJsNodes(nodeName, nodeVersions)

export default mDeleteUsersNodes
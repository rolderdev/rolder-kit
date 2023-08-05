import { getJsNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { jsPorts } from "../../../main/ports/v0.1.0/ports"

const { deleteItems } = jsPorts.Data
const { deleting } = jsPorts.States
const { deleted } = jsPorts.Signals

const nodeName = 'mDelete'
const nodeVersions: JsNode = {
    '0.1.0': {
        nodeImport: import('./v0.1.0/mDelete'),
        inputs: { deleteItems },
        outputs: { deleting, deleted }
    }
}

const mDeleteNodes = getJsNodes(nodeName, nodeVersions)

export default mDeleteNodes
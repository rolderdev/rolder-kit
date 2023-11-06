import { getJsNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { jsPorts } from "../../../main/ports/v0.1.0/ports"

const { updateItem, updatedItem } = jsPorts.Data
const { updating } = jsPorts.States
const { updated } = jsPorts.Signals

const nodeName = 'update'
const nodeVersions: JsNode = {
    '0.1.0': {
        nodeImport: import('./v0.1.0/update'),
        inputs: { updateItem },
        outputs: { updating, updated, updatedItem }
    }
}

const updateNodes = getJsNodes(nodeName, nodeVersions)
export default updateNodes
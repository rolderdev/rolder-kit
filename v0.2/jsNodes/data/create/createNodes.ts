import { getJsNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { jsPorts } from "../../../main/ports/v0.1.0/ports"

const { createItem, createdItem } = jsPorts.Data
const { creating } = jsPorts.States
const { created } = jsPorts.Signals

const nodeName = 'create'
const nodeVersions: JsNode = {
    '0.1.0': {
        nodeImport: import('./v0.1.0/create'),
        inputs: { createItem },
        outputs: { creating, created, createdItem }
    }
}

const createNodes = getJsNodes(nodeName, nodeVersions)

export default createNodes
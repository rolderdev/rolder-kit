import { getJsNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { jsPorts } from "../../../main/ports/v0.1.0/ports"

const { createItems, createdItems } = jsPorts.Data
const { creating } = jsPorts.States
const { created } = jsPorts.Signals

const nodeName = 'mCreate'
const nodeVersions: JsNode = {
    '0.1.0': {
        nodeImport: import('./v0.1.0/mCreate'),
        inputs: { createItems },
        outputs: { creating, created, createdItems }
    }
}

const mCreateNodes = getJsNodes(nodeName, nodeVersions)

export default mCreateNodes
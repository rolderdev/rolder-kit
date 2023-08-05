import { getJsNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { jsPorts } from "../../../main/ports/v0.1.0/ports"

const { updateItems, updatedItems } = jsPorts.Data
const { updating } = jsPorts.States
const { updated } = jsPorts.Signals

const nodeName = 'mUpdate'
const nodeVersions: JsNode = {
    '0.1.0': {
        nodeImport: import('./v0.1.0/mUpdate'),
        inputs: { updateItems },
        outputs: { updating, updated, updatedItems }
    }
}

const mUpdateNodes = getJsNodes(nodeName, nodeVersions)

export default mUpdateNodes
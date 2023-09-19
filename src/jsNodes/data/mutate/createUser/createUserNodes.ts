import { getJsNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { jsPorts } from "../../../../main/ports/v0.1.0/ports"

const { createUserItem, createdUserItem } = jsPorts.Data
const { creating } = jsPorts.States
const { created } = jsPorts.Signals

const nodeName = 'createUser'
const nodeVersions: JsNode = {
    '0.1.0': {
        nodeImport: import('./v0.1.0/createUser'),
        inputs: { createUserItem },
        outputs: { creating, created, createdUserItem }
    }
}

const createUserNodes = getJsNodes(nodeName, nodeVersions)

export default createUserNodes
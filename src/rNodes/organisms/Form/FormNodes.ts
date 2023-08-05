import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Form_v0_1_0 from "./v0.1.0/Form"

const { formScheme } = reactPorts.Params
const { formHook } = reactPorts.Form
const { submited } = reactPorts.Signals

const nodeName = 'Form'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Form_v0_1_0,
        allowChildren: true,
        inputs: { formScheme },
        outputs: { formHook, submited },
        inputsToCheck: ['formScheme'],
    },
}

const FormNodes = getReactNodes(nodeName, nodeVersions)

export default FormNodes
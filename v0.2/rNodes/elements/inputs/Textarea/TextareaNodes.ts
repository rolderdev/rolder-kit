import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Textarea_v0_1_0 from "./v0.1.0/Textarea"

const { disabled } = reactPorts.States
const { label, placeholder } = reactPorts.Data
const { withAsterisk } = reactPorts.Params
const { radius } = reactPorts.Style
const { w, h } = reactPorts.Dimensions

const nodeName = 'Textarea'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Textarea_v0_1_0,
        inputs: { ...reactPorts.Margins, ...reactPorts.Form, label, placeholder, withAsterisk, radius, disabled, w, h },
        inputRules: [{ condition: "useForm = true", inputs: ["formField"] }]
    },
}

const TextareaNodes = getReactNodes(nodeName, nodeVersions)

export default TextareaNodes
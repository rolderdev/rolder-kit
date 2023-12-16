import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import TextInput_v0_2_0 from "./v0.2.0/TextInput"

const { disabled } = reactPorts.States
const { label, placeholder, inputString } = reactPorts.Data
const { withAsterisk, debounced, delay } = reactPorts.Params
const { radius } = reactPorts.Style
const { w, h } = reactPorts.Dimensions

const nodeName = 'TextInput'
const nodeVersions: RNode = {
    '0.2.0': {
        ReactComp: TextInput_v0_2_0,
        inputs: { ...reactPorts.Margins, ...reactPorts.Form, ...reactPorts.Icon, label, placeholder, disabled, radius, withAsterisk, w, h, debounced, delay },
        outputs: { inputString },
        inputRules: [{ condition: "useForm = true", inputs: ["formField"] }, { condition: "debounced = true", inputs: ["delay"] }]
    },
}

const TextInputNodes = getReactNodes(nodeName, nodeVersions)

export default TextInputNodes
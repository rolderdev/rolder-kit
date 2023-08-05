import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import MultiSelect_v0_1_0 from "./v0.1.0/MultiSelect"

const { disabled } = reactPorts.States
const { value, inputItems, label, placeholder } = reactPorts.Data
const { withAsterisk, labelField, searchable, clearable } = reactPorts.Params
const { selected } = reactPorts.Signals
const { radius } = reactPorts.Style

const nodeName = 'MultiSelect'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: MultiSelect_v0_1_0,
        inputs: {
            ...reactPorts.Margins, ...reactPorts.Form, value, label, placeholder, disabled, inputItems, radius, withAsterisk, labelField,
            searchable, clearable
        },
        outputs: { selected },
        inputRules: [{ condition: "useForm = true", inputs: ["formField"] }]
    },
}

const MultiSelectNodes = getReactNodes(nodeName, nodeVersions)

export default MultiSelectNodes
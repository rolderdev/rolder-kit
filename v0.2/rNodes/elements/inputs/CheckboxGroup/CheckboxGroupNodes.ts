import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import CheckboxGroup_v0_1_0 from "./v0.1.0/CheckboxGroup"

const { disabled } = reactPorts.States
const { value, inputItems, selectedValue } = reactPorts.Data
const { direction, spacing, grow } = reactPorts.Layout
const { size } = reactPorts.Dimensions
const { color } = reactPorts.Style

const nodeName = 'CheckboxGroup'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: CheckboxGroup_v0_1_0,
        inputs: { ...reactPorts.Margins, ...reactPorts.Form, size, value, color, disabled, direction, inputItems, spacing, grow },
        outputs: { selectedValue },
        inputsToCheck: ['inputItems'],
        inputRules: [{ condition: "useForm = true", inputs: ["formField"] }]
    },
}

const CheckboxGroupNodes = getReactNodes(nodeName, nodeVersions)

export default CheckboxGroupNodes
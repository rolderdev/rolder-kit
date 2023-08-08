import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import SegmentedControl_v0_1_0 from "./v0.1.0/SegmentedControl"
import SegmentedControl_v0_2_0 from "./v0.2.0/SegmentedControl"

const { disabled } = reactPorts.States
const { value, inputItems, selectedValue, selectedItem, items, customItems, } = reactPorts.Data
const { orientation } = reactPorts.Layout
const { size } = reactPorts.Dimensions
const { color, radius } = reactPorts.Style
const { labelField, useCustomItems } = reactPorts.Params
const { selected } = reactPorts.Signals

const nodeName = 'SegmentedControl'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: SegmentedControl_v0_1_0,
        inputs: { ...reactPorts.Margins, ...reactPorts.Form, size, value, color, disabled, orientation, inputItems, radius },
        outputs: { selectedValue },
        inputsToCheck: ['inputItems'],
        inputRules: [{ condition: "useForm = true", inputs: ["formField"] }]
    },
    '0': {
        ReactComp: SegmentedControl_v0_2_0,
        inputs: {
            ...reactPorts.Margins, ...reactPorts.Form, size, color, disabled, orientation, radius, items, customItems, labelField,
            selectedInputItem: { ...selectedItem }, useCustomItems
        },
        outputs: { selected, selectedItem },
        inputRules: [
            { condition: "useForm = true", inputs: ["formField"] },
            { condition: "useCustomItems = true", inputs: ["customItems"] },
            { condition: "useCustomItems = false", inputs: ['items', 'labelField'] },
        ]
    },
}

const SegmentedControlNodes = getReactNodes(nodeName, nodeVersions)

export default SegmentedControlNodes
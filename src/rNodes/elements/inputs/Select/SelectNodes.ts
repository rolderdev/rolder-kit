import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Select_v0_2_0 from "./v0.2.0/Select"
import Select_v0_3_0 from "./v0.3.0/Select"
import Select_v0_4_0 from "./v0.4.0/Select"

const { disabled } = reactPorts.States
const { value, inputItems, label, placeholder, createValue, selectedItem, items, customItems } = reactPorts.Data
const { withAsterisk, labelField, searchable, clearable, creatable, useCustomItems } = reactPorts.Params
const { selected, create } = reactPorts.Signals
const { radius } = reactPorts.Style

const nodeName = 'Select'
const nodeVersions: RNode = {
    '0.2.0': {
        ReactComp: Select_v0_2_0,
        inputs: {
            ...reactPorts.Margins, ...reactPorts.Form, value, label, placeholder, disabled, inputItems, radius, withAsterisk, labelField,
            searchable, clearable, creatable
        },
        outputs: { selected, create, createValue },
        inputRules: [{ condition: "useForm = true", inputs: ["formField"] }]
    },
    '0.3.0': {
        ReactComp: Select_v0_3_0,
        inputs: {
            ...reactPorts.Margins, ...reactPorts.Form, selectedItem, label, placeholder, disabled, items, customItems, radius, withAsterisk, labelField,
            searchable, clearable, creatable, useCustomItems
        },
        outputs: { selected, create, createValue },
        inputRules: [
            { condition: "useForm = true", inputs: ["formField"] },
            { condition: "useCustomItems = true", inputs: ["customItems"] },
            { condition: "useCustomItems = false", inputs: ['items', 'labelField'] },
        ]
    },
    '0': {
        ReactComp: Select_v0_4_0,
        inputs: {
            ...reactPorts.Margins, ...reactPorts.Form, selectedInputItem: { ...selectedItem }, label, placeholder, disabled, items, customItems, radius, withAsterisk, labelField,
            searchable, clearable, creatable, useCustomItems
        },
        outputs: { selected, create, createValue, selectedItem },
        inputRules: [
            { condition: "useForm = true", inputs: ["formField"] },
            { condition: "useCustomItems = true", inputs: ["customItems"] },
            { condition: "useCustomItems = false", inputs: ['items', 'labelField'] },
        ]
    },
}

const SelectNodes = getReactNodes(nodeName, nodeVersions)

export default SelectNodes
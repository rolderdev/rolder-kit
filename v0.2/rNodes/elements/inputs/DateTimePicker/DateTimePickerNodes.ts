import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import DateTimePicker_v0_1_0 from "./v0.1.0/DateTimePicker"

const { disabled } = reactPorts.States
const { label, placeholder } = reactPorts.Data
const { withAsterisk, dateFormat, limitMinDate, daysOffset } = reactPorts.Params
const { radius } = reactPorts.Style

const nodeName = 'DateTimePicker'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: DateTimePicker_v0_1_0,
        inputs: { ...reactPorts.Margins, ...reactPorts.Form, label, placeholder, withAsterisk, radius, disabled, dateFormat, limitMinDate, daysOffset },
        inputRules: [{ condition: "useForm = true", inputs: ["formField"] }, { condition: "limitMinDate = true", inputs: ["daysOffset"] }]
    },
}

const DateTimePickerNodes = getReactNodes(nodeName, nodeVersions)

export default DateTimePickerNodes
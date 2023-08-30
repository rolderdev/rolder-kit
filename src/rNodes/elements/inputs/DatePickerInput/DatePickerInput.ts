import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import DatePickerInput_v0_1_0 from "./v0.1.0/DatePickerInput"

const { disabled } = reactPorts.States
const { label, placeholder, selectedDates, selectedDate }: any = reactPorts.Data
const { withAsterisk, dateFormat, limitMinDate, daysOffset, clearable, datePickerType: { ...type }, }: any = reactPorts.Params
const { radius } = reactPorts.Style
const { dropdownType } = reactPorts.Layout

const nodeName = 'DatePickerInput'
const nodeVersions: RNode = {
    '0': {
        ReactComp: DatePickerInput_v0_1_0,
        inputs: {
            ...reactPorts.Margins, ...reactPorts.Form, label, placeholder, withAsterisk, radius, disabled, dateFormat, limitMinDate, daysOffset,
            clearable, type, dropdownType, selectedInputDates: { ...selectedDates }, selectedInputDate: { ...selectedDate },
        },
        outputs: { selectedDates, selectedDate },
        inputRules: [{ condition: "useForm = true", inputs: ["formField"] }, { condition: "limitMinDate = true", inputs: ["daysOffset"] }]
    },
}

const DatePickerInputNodes = getReactNodes(nodeName, nodeVersions)

export default DatePickerInputNodes
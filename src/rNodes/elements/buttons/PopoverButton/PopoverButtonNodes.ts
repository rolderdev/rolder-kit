import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import PopoverButton_v0_1_0 from "./v0.1.0/PopoverButton"

const { label } = reactPorts.Data
const { disabled } = reactPorts.States
const { clicked } = reactPorts.Signals
const { size } = reactPorts.Dimensions
const { color, radius, actionVariant: { ...variant } } = reactPorts.Style
const { buttonType } = reactPorts.Params

const nodeName = 'PopoverButton'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: PopoverButton_v0_1_0,
        inputs: { ...reactPorts.Margins, ...reactPorts.Icon, disabled, size, radius, color, variant, label, buttonType },
        outputs: { clicked },
    },
}

const PopoverButtonNodes = getReactNodes(nodeName, nodeVersions)

export default PopoverButtonNodes

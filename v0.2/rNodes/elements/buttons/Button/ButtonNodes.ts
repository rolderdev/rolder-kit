import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Button_v0_1_1 from "./v0.1.1/Button"

const { label } = reactPorts.Data
const { disabled, loading } = reactPorts.States
const { clicked } = reactPorts.Signals
const { size } = reactPorts.Dimensions
const { color, radius, actionVariant: { ...variant } } = reactPorts.Style
const { buttonType } = reactPorts.Params

const nodeName = 'Button'
const nodeVersions: RNode = {
    '0.1.1': {
        ReactComp: Button_v0_1_1,
        inputs: { ...reactPorts.Margins, ...reactPorts.Paddings, ...reactPorts.Icon, disabled, size, radius, color, loading, variant, label, buttonType },
        outputs: { clicked },
    },
}

const ButtonNodes = getReactNodes(nodeName, nodeVersions)

export default ButtonNodes
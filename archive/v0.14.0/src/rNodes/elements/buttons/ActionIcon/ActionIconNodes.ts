import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import ActionIcon_v0_1_1 from "./v0.1.1/ActionIcon"
import ActionIcon_v0_2_0 from "./v0.2.0/ActionIcon"

const { disabled, loading } = reactPorts.States
const { clicked } = reactPorts.Signals
const { size } = reactPorts.Dimensions
const { color, radius, actionVariant: { ...variant } } = reactPorts.Style

const nodeName = 'ActionIcon'
const nodeVersions: RNode = {
    '0.1.1': {
        ReactComp: ActionIcon_v0_1_1,
        inputs: { ...reactPorts.Margins, ...reactPorts.Paddings, ...reactPorts.Icon, disabled, size, radius, color, variant },
        outputs: { clicked },
    },
    '0': {
        ReactComp: ActionIcon_v0_2_0,
        inputs: { ...reactPorts.Margins, ...reactPorts.Paddings, ...reactPorts.Icon, disabled, size, radius, color, variant, loading },
        outputs: { clicked },
    }
}

const ActionIconNodes = getReactNodes(nodeName, nodeVersions)

export default ActionIconNodes
import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Badge_v0_1_0 from "./v0.1.0/Badge"

const { size } = reactPorts.Dimensions
const { color, radius, badgeVariant: { ...variant } } = reactPorts.Style
const { label } = reactPorts.Data

const nodeName = 'Badge'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Badge_v0_1_0,
        allowChildren: true,
        inputs: { ...reactPorts.Margins, ...reactPorts.Icon, variant, size, radius, color, label },
    },
}

const BadgeNodes = getReactNodes(nodeName, nodeVersions)

export default BadgeNodes
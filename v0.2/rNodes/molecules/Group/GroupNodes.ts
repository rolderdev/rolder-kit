import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Group_v0_1_0 from "./v0.1.0/Group"
import Group_v0_2_0 from "./v0.2.0/Group"

const { position, grow, spacing } = reactPorts.Layout
const { w, h } = reactPorts.Dimensions
const { opacity } = reactPorts.Style

const nodeName = 'Group'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Group_v0_1_0,
        allowChildren: true,
        inputs: { ...reactPorts.Margins, w, h, ...reactPorts.Paddings, position, grow, spacing, opacity },
    },
    '0.2.0': {
        ReactComp: Group_v0_2_0,
        allowChildren: true,
        inputs: { ...reactPorts.Margins, w, h, ...reactPorts.Paddings, position, grow, spacing, opacity },
    }
}

const GroupNodes = getReactNodes(nodeName, nodeVersions)

export default GroupNodes
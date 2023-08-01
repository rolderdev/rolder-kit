import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Paper_v0_1_0 from "./v0.1.0/Paper"

const { shadow, radius, withBorder } = reactPorts.Style
const { backgroundColor, colorShade } = reactPorts.Sx

const nodeName = 'Paper'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Paper_v0_1_0,
        allowChildren: true,
        inputs: { ...reactPorts.Margins, ...reactPorts.Paddings, shadow, radius, withBorder, backgroundColor, colorShade },
    }
}

const PaperNodes = getReactNodes(nodeName, nodeVersions)

export default PaperNodes
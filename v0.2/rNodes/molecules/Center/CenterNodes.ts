import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Center_v0_1_0 from "./v0.1.0/Center"

const { w, h } = reactPorts.Dimensions
const { opacity } = reactPorts.Style

const nodeName = 'Center'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Center_v0_1_0,
        allowChildren: true,
        inputs: { ...reactPorts.Margins, w, h, ...reactPorts.Paddings, opacity },
    }
}

const CenterNodes = getReactNodes(nodeName, nodeVersions)

export default CenterNodes
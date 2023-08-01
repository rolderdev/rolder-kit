import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import ScrollArea_v0_1_0 from "./v0.1.0/ScrollArea"

const { w } = reactPorts.Dimensions
const { opacity } = reactPorts.Style
const { bottomOffset } = reactPorts.Layout
const { offsetScrollbars } = reactPorts.Params

const nodeName = 'ScrollArea'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: ScrollArea_v0_1_0,
        allowChildren: true,
        inputs: { w, bottomOffset, offsetScrollbars, opacity },
    }
}

const ScrollAreaNodes = getReactNodes(nodeName, nodeVersions)

export default ScrollAreaNodes
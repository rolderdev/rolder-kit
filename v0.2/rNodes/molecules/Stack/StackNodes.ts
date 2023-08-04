import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Stack_v0_1_1 from "./v0.1.1/Stack"

const { stackAlign: { ...align }, stackJustify: { ...justify }, spacing } = reactPorts.Layout
const { opacity } = reactPorts.Style
const { w, h } = reactPorts.Dimensions

const nodeName = 'Stack'
const nodeVersions: RNode = {
    '0.1.1': {
        ReactComp: Stack_v0_1_1,
        allowChildren: true,
        inputs: { ...reactPorts.Margins, w, h, ...reactPorts.Paddings, align, justify, spacing, opacity },
    }
}

const StackNodes = getReactNodes(nodeName, nodeVersions)

export default StackNodes
import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Icon_v0_1_0 from "./v0.1.0/Icon"
import Icon_v0_2_0 from "./v0.2.0/Icon"

const { sizeUnits: { ...size } } = reactPorts.Dimensions
const { iconName, stroke } = reactPorts.Icon
const { color } = reactPorts.Style

const nodeName = 'Icon'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Icon_v0_1_0,
        inputs: { ...reactPorts.Margins, size, iconName, stroke, color },
    },
    '0': {
        ReactComp: Icon_v0_2_0,
        inputs: { ...reactPorts.Margins, size, iconName, stroke, color },
    },
}

const IconNodes = getReactNodes(nodeName, nodeVersions)

export default IconNodes
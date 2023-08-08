import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Indicator_v0_1_0 from "./v0.1.0/Indicator"

const { sizeNumber: { ...size } } = reactPorts.Dimensions
const { color, radius, withBorder } = reactPorts.Style
const { indicatorPosition: { ...position } } = reactPorts.Layout
const { processing, disabled } = reactPorts.States
const { inline } = reactPorts.Params
const { label } = reactPorts.Data

const nodeName = 'Indicator'
const nodeVersions: RNode = {
    '0': {
        ReactComp: Indicator_v0_1_0,
        allowChildren: true,
        inputs: { color, size, position, radius, processing, withBorder, disabled, inline, label },
        inputRules: [{ condition: "inline = true", inputs: ["label"] }]
    },
}

const IndicatorNodes = getReactNodes(nodeName, nodeVersions)

export default IndicatorNodes
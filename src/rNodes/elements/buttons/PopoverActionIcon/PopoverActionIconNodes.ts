import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import PopoverActionIcon_v0_1_1 from "./v0.1.1/PopoverActionIcon"

const { disabled } = reactPorts.States
const { size } = reactPorts.Dimensions
const { color, radius, actionVariant: { ...variant }, shadow } = reactPorts.Style
const { popoverPosition: { ...position } } = reactPorts.Layout
const { withArrow } = reactPorts.Params

const nodeName = 'PopoverActionIcon'
const nodeVersions: RNode = {
    '0': {
        ReactComp: PopoverActionIcon_v0_1_1,
        allowChildren: true,
        inputs: {
            ...reactPorts.Margins, ...reactPorts.Paddings, ...reactPorts.Icon, disabled, size, radius, color, variant, withArrow, shadow,
            position
        },
    },
}

const PopoverActionIconNodes = getReactNodes(nodeName, nodeVersions)

export default PopoverActionIconNodes

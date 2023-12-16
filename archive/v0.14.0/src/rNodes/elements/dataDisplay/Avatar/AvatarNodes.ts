import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Avatar_v0_1_0 from "./v0.1.0/Avatar"

const { size } = reactPorts.Dimensions
const { color, radius, avatarVariant: { ...variant } } = reactPorts.Style
const { customSx: { ...sx } } = <any>reactPorts.Sx

const nodeName = 'Avatar'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Avatar_v0_1_0,
        allowChildren: true,
        inputs: { ...reactPorts.Margins, size, radius, color, variant, sx },
    },
}

const AvatarNodes = getReactNodes(nodeName, nodeVersions)

export default AvatarNodes
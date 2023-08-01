import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Auth_v0_1_0 from "./v0.1.0/Auth"

const { shadow, buttonColor } = reactPorts.Style
const { spacing: { ...stackSpacing } } = reactPorts.Layout
stackSpacing.displayName = 'Stack spacing'
const { w, h } = reactPorts.Dimensions
const { authenticated } = reactPorts.Signals

const nodeName = 'Auth'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Auth_v0_1_0,
        inputs: { ...reactPorts.Margins, ...reactPorts.Paddings, w, h, shadow, stackSpacing, buttonColor },
        outputs: { authenticated },
    }
}

const AuthNodes = getReactNodes(nodeName, nodeVersions)

export default AuthNodes
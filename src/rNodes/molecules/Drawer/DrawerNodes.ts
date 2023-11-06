import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Drawer_v0_1_1 from "./v0.1.1/Drawer"

const { title } = reactPorts.Data
const { size, sizeUnits } = reactPorts.Dimensions
const { show, hided } = reactPorts.Signals
const { opacity } = reactPorts.Style
const { drawerPosition: { ...position } } = reactPorts.Layout
const { withCloseButton } = reactPorts.Params

const nodeName = 'Drawer'
const nodeVersions: RNode = {
    '0.1.1': {
        ReactComp: Drawer_v0_1_1,
        allowChildren: true,
        inputs: { position, title, size, sizeUnits, show, withCloseButton, opacity },
        outputs: { hided }
    }
}

const DrawerNodes = getReactNodes(nodeName, nodeVersions)

export default DrawerNodes
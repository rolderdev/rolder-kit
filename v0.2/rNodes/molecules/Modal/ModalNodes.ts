import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Modal_v0_1_1 from "./v0.1.1/Modal"

const { title } = reactPorts.Data
const { show, hided } = reactPorts.Signals
const { withCloseButton } = reactPorts.Params
const { sizeString: { ...size } } = reactPorts.Dimensions

const nodeName = 'Modal'
const nodeVersions: RNode = {
    '0.1.1': {
        ReactComp: Modal_v0_1_1,
        allowChildren: true,
        inputs: { ...reactPorts.Paddings, title, size, show, withCloseButton },
        outputs: { hided }
    }
}

const ModalNodes = getReactNodes(nodeName, nodeVersions)

export default ModalNodes
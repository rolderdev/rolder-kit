import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import UnstyledButton_v0_1_0 from "./v0.1.0/UnstyledButton"

const { clicked } = reactPorts.Signals

const nodeName = 'UnstyledButton'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: UnstyledButton_v0_1_0,
        allowChildren: true,
        outputs: { clicked },
    }
}

const UnstyledButtonNodes = getReactNodes(nodeName, nodeVersions)

export default UnstyledButtonNodes
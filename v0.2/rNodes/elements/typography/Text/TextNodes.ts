import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Text_v0_2_1 from "./v0.2.1/Text"
import Text_v0_2_2 from "./v0.2.2/Text"

const { value } = reactPorts.Data
const { color } = reactPorts.Style

const nodeName = 'Text'
const nodeVersions: RNode = {
    '0.2.1': {
        ReactComp: Text_v0_2_1,
        inputs: { ...reactPorts.Margins, ...reactPorts.Font, color, value },
    },
    '0.2.2': {
        ReactComp: Text_v0_2_2,
        inputs: { ...reactPorts.Margins, ...reactPorts.Font, color, value },
    }
}

const TextNodes = getReactNodes(nodeName, nodeVersions)

export default TextNodes
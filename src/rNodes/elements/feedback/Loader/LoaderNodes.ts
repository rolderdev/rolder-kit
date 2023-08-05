import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Loader_v0_1_0 from "./v0.1.0/Loader"

const { size } = reactPorts.Dimensions
const { color, loaderVariant: { ...variant } } = reactPorts.Style

const nodeName = 'Loader'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Loader_v0_1_0,
        inputs: { ...reactPorts.Margins, color, size, variant },
    },
}

const LoaderNodes = getReactNodes(nodeName, nodeVersions)

export default LoaderNodes
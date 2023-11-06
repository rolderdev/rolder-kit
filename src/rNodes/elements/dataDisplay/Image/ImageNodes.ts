import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import Image_v0_1_0 from "./v0.1.0/Image"

const { sourceUrl } = reactPorts.Data
const { radius } = reactPorts.Style
const { maw } = reactPorts.Dimensions

const nodeName = 'Image'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Image_v0_1_0,
        allowChildren: true,
        inputs: { ...reactPorts.Margins, sourceUrl, radius, maw },
    },
}

const ImageNodes = getReactNodes(nodeName, nodeVersions)

export default ImageNodes
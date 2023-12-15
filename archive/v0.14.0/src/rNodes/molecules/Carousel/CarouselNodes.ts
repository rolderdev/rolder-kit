import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Carousel_v0_1_1 from "./v0.1.1/Carousel"

const nodeName = 'Carousel'
const nodeVersions: RNode = {
    '0.1.1': {
        ReactComp: Carousel_v0_1_1,
        allowChildren: true,
        reqiereChildren: true,
        inputs: {},
    }
}

const CarouselNodes = getReactNodes(nodeName, nodeVersions)

export default CarouselNodes
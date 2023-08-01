import { getReactNodes } from "../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../main/ports/v0.1.0/ports"

import Grid_v0_1_0 from "./v0.1.0/Grid"

const { w, h } = reactPorts.Dimensions
const { gutter, spans } = reactPorts.Layout

const nodeName = 'Grid'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: Grid_v0_1_0,
        allowChildren: true,
        reqiereChildren: true,
        inputs: { ...reactPorts.Margins, ...reactPorts.Paddings, w, h, gutter, spans },
        inputsToCheck: ['spans']
    }
}

const GridNodes = getReactNodes(nodeName, nodeVersions)

export default GridNodes
import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import QRCode_v0_1_0 from "./v0.1.0/QRCode"

const { value } = reactPorts.Data
const { qrCodeLevel } = reactPorts.Params
const { sizeUnits: { ...size } } = reactPorts.Dimensions

const nodeName = 'QRCode'
const nodeVersions: RNode = {
    '0.1.0': {
        ReactComp: QRCode_v0_1_0,
        allowChildren: true,
        inputs: { value, size, level: qrCodeLevel },
    },
}

const QRCodeNodes = getReactNodes(nodeName, nodeVersions)

export default QRCodeNodes
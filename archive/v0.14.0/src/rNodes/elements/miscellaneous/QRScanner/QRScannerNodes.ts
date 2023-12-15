import { getReactNodes } from "../../../../main/getNodes/v0.1.0/getNodes"
import { reactPorts } from "../../../../main/ports/v0.1.0/ports"

import QRScanner_v0_1_0 from "./v0.1.0/QRScanner"

const { qrString } = reactPorts.Data
const { qrScanned } = reactPorts.Signals
const { maxScansPerSecond } = reactPorts.Params

const nodeName = 'QRScanner'
const nodeVersions: RNode = {
    '0': {
        ReactComp: QRScanner_v0_1_0,
        inputs: { maxScansPerSecond },
        outputs: { qrScanned, qrString },
    },
}

const QRScannerNodes = getReactNodes(nodeName, nodeVersions)

export default QRScannerNodes
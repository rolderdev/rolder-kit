import { getJsNode } from '../../../main/getNodes/v0.5.0/getNode'
import { JsVersions } from '../../../main/getNodes/v0.5.0/types'
import { getPorts } from '../../../main/ports/v0.3.0/get'

const jsVersions: JsVersions = {
    'v0.1.0': {
        signals: import('./v0.1.0/createXlsx'),
        inputs: [...getPorts({ type: 'input', portNames: ['createXlsx', 'xlsxColumns', 'items', 'fileName', 'sheetName', 'xlsxCompression'] })],
        outputs: [...getPorts({ type: 'output', portNames: ['creating', 'created'] })]
    }
}

const nodeName = 'createXlsx'
const nodeVersion = 'v0'
export default getJsNode({ nodeName, nodeVersion, jsVersions, color: 'green' })
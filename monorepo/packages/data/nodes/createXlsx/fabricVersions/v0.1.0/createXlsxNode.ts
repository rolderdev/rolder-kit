import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/createXlsx'

const jsVersions: JsVersions = {
    'v0.2.0': {
        inputs: getPorts('input', ['createXlsx', 'xlsxColumns', 'items', 'fileName', 'sheetName', 'xlsxCompression']),
        outputs: getPorts('output', ['creating', 'created']),
        signals: v0_2_0.signals,
    }
}

export default getJsNode('createXlsx', jsVersions, 'green', false)
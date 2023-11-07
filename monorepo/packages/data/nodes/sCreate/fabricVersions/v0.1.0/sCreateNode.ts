import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_3_0 from './v0.3.0/sCreate'

const jsVersions: JsVersions = {
    'v0.3.0': {
        inputs: getPorts('input', ['createScheme', 'create']),
        outputs: getPorts('output', ['createdData', 'created', 'creating']),
        signals: v0_3_0.signals
    }
}

export default getJsNode('sCreate', jsVersions, 'green', true)
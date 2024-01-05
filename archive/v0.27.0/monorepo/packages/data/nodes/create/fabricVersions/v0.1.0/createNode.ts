import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_4_0 from './v0.4.0/create'

const jsVersions: JsVersions = {
    'v0.4.0': {
        hashTag: 'experimental',
        inputs: getPorts('input', ['createScheme', 'create']),
        outputs: getPorts('output', ['createdData', 'created', 'creating']),
        signals: v0_4_0.signals
    }
}

export default getJsNode('create', jsVersions, 'green')
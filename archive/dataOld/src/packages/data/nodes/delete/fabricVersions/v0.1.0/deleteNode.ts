import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_3_0 from './v0.3.0/delete'

const jsVersions: JsVersions = {
    'v0.3.0': {
        hashTag: 'experimental',
        inputs: getPorts('input', ['deleteScheme', 'delete']),
        outputs: getPorts('output', ['deleted', 'deleting']),
        signals: v0_3_0.signals
    }
}

export default getJsNode('delete', jsVersions, 'green')
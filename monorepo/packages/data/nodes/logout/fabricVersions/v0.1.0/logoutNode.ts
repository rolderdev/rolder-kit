import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/logout'

const jsVersions: JsVersions = {
    'v0.1.0': {
        inputs: getPorts('input', ['logout']),
        outputs: getPorts('output', ['loggedOut']),
        signals: v0_1_0.signals
    }
}

export default getJsNode('logout', jsVersions, 'grey', false)
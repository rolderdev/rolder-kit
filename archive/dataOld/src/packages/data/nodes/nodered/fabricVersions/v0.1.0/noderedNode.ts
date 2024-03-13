import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/nodered'

const jsVersions: JsVersions = {
    'v0.1.0': {
        inputs: getPorts('input', ['execute', 'flowEndpoint', 'flowData'], ['flowEndpoint']),
        outputs: getPorts('output', ['executing', 'executed', 'result']),
        signals: v0_1_0.signals
    }
}

export default getJsNode('nodered', jsVersions, 'green')
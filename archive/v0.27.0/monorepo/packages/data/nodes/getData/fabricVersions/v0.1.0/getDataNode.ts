import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/getData'

const jsVersions: JsVersions = {
    'v0.2.0': {
        hashTag: 'experimental',
        inputs: getPorts('input', ['fetch', 'dbClasses', 'getDataScheme'], ['dbClasses']),
        outputs: getPorts('output', ['fetched', 'fetching']),
        signals: v0_2_0.signals,
    }
}

export default getJsNode('getData', jsVersions, 'green')
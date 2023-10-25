import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/getData'

const jsVersions: JsVersions = {
    'v0.1.0': {
        inputs: getPorts(
            'input',
            ['fetch', 'dbClass', 'filters', 'sorts', 'options'],
            ['dbClass', 'searchFields']),
        outputs: getPorts('output', ['items', 'fetching', 'fetched']),
        signals: v0_1_0.signals,
    }
}

export default getJsNode('getData', jsVersions, 'green', true)
import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v1_0_0 from './v0.1.0/useData'

const jsVersions: JsVersions = {
    'v0.1.0': {
        inputs: getPorts(
            'input',
            ['fetch', 'queryType', 'fetchOnMount', 'dbClass', 'filters', 'sorts', 'options', 'subscribe', 'references', 'backReferences',
                'searchFields', 'searchEnabled', 'searchString', 'useReferences'],
            ['dbClass', 'searchFields']),
        outputs: getPorts('output', ['items', 'fetching', 'fetched', 'searching', 'founded']),
        onInputChange: v1_0_0.onInputChange,
        signals: v1_0_0.signals,
        onDelete: v1_0_0.onDelete,
    }
}

export default getJsNode('useData', jsVersions, 'green', true)
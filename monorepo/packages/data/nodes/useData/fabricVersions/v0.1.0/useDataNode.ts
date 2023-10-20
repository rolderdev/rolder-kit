import { getJsNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/useData'
import v0_2_0 from './v0.2.0/useData'

const jsVersions: JsVersions = {
    'v0.1.0': {
        inputs: getPorts(
            'input',
            ['fetch', 'queryType', 'fetchOnMount', 'dbClass', 'filters', 'sorts', 'options', 'subscribe', 'references', 'backReferences',
                'searchFields', 'searchEnabled', 'searchString', 'useReferences', 'refetchOnFocus'],
            ['dbClass', 'searchFields']),
        outputs: getPorts('output', ['items', 'fetching', 'fetched', 'searching', 'founded']),
        onInputChange: v0_1_0.onInputChange,
        signals: v0_1_0.signals,
        onDelete: v0_1_0.onDelete,
    },
    'v0.2.0': {
        inputs: getPorts(
            'input',
            ['fetch', 'refetch', 'queryType', 'fetchOnMount', 'dbClass', 'filters', 'sorts', 'options', 'subscribe', 'references', 'backReferences',
                'searchFields', 'searchEnabled', 'searchString', 'useReferences', 'refetchOnFocus', 'getUsers'],
            ['dbClass', 'searchFields']),
        outputs: getPorts('output', ['items', 'fetching', 'refetching', 'fetched', 'refetched', 'searching', 'founded']),
        onInputChange: v0_2_0.onInputChange,
        signals: v0_2_0.signals,
        onDelete: v0_2_0.onDelete,
    }
}

export default getJsNode('useData', jsVersions, 'green', true)
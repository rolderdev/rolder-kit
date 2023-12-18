import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_10_0 from './v0.10.0/UseData'
import v0_11_0 from './v0.11.0/UseData'
import v0_12_0 from './v0.12.0/UseData'
import v0_12_1 from './v0.12.1/UseData'

//===================================================================

const compVersions: CompVersions = {
    'v0.10.0': {
        hashTag: 'deprecated',
        Comp: v0_10_0,
        inputs: getPorts('input', ['dbClass', 'filters', 'sorts', 'options', 'refs', 'backRefs',
            'searchEnabled', 'searchString', 'searchScheme', 'getUsers'],
            ['dbClass', 'searchScheme']),
        outputs: getPorts('output', ['items', 'fetched', 'founded', 'pending', 'fetching', 'searching']),
        signals: getPorts('input', ['refetch'])
    },
    'v0.11.0': {
        hashTag: 'deprecated',
        Comp: v0_11_0,
        inputs: getPorts('input', ['dbClasses', 'useDataScheme', 'searchString'], ['dbClasses']),
        outputs: getPorts('output', ['fetched', 'founded', 'pending', 'fetching']),
        signals: getPorts('input', ['refetch'])
    },
    'v0.12.0': {
        hashTag: 'deprecated',
        Comp: v0_12_0,
        inputs: getPorts(
            'input',
            [
                'useDataContext', 'dbClass2', 'filters', 'sorts', 'querySize', 'refs', 'backRefs', 'getUsers',
                'searchFields', 'searchString', 'aggQuery'
            ],
            ['dbClass2']
        ),
        outputs: getPorts('output',
            ['items', 'fetched', 'fetching', 'fetchedPage', 'fetchedItemsCount', 'totalItemsCount', 'aggregations']
        ),
        signals: getPorts('input', ['nextFetch', 'previousFetch'])
    },
    'v0.12.1': {
        Comp: v0_12_1,
        inputs: getPorts(
            'input',
            [
                'useDataContext', 'dbClass2', 'filters', 'sorts', 'querySize', 'refs', 'backRefs', 'getUsers',
                'searchFields', 'searchString', 'aggQuery'
            ],
            ['dbClass2']
        ),
        outputs: getPorts('output',
            ['items', 'fetched', 'fetching', 'fetchedPage', 'fetchedItemsCount', 'totalItemsCount', 'aggregations']
        ),
        signals: getPorts('input', ['nextFetch', 'previousFetch'])
    }
}

//===================================================================

export default getReactNode('UseData', compVersions, false)
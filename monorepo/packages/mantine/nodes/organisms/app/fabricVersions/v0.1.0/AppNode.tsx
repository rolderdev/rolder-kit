import { getReactNode } from '../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getPorts } from '../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v1_1_0 from './v1.1.0/App'

const compVersions: CompVersions = {
    'v1.1.0': {
        Comp: v1_1_0,
        inputs: [...getPorts('input',
            ['detectColorScheme', 'colorScheme', 'notificationsPosition', 'connectKuzzle', 'appLoaderSize', 'loaderColor'])],
        outputs: [...getPorts('output', ['userRole'])]
    }
}

//===================================================================

export default getReactNode('App', compVersions, true)
import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/Mantine'
import v0_2_0 from './v0.2.0/MantineLazy'

const compVersions: CompVersions = {
    'v0.1.0': {
        hashTag: 'experimental',
        Comp: v0_1_0,
        inputs: getPorts('input', ['detectColorScheme', 'colorScheme', 'notificationsPosition']),
    },
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts('input', ['notificationsPosition', 'mantineTheme']),
    },
}

//===================================================================

export default getReactNode('Mantine', compVersions, true)
import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
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
import v1_1_0 from './v1.1.0/App'
import v1_2_0 from './v1.2.0/App'
import v1_3_0 from './v1.3.0/App'
import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'

const compVersions: CompVersions = {
    'v1.1.0': {
        hashTag: 'deprecated',
        Comp: v1_1_0,
        inputs: [...getPorts('input',
            ['detectColorScheme', 'colorScheme', 'notificationsPosition', 'connectKuzzle', 'appLoaderSize', 'loaderColor'])],
        outputs: [...getPorts('output', ['userRole'])]
    },
    'v1.2.0': {
        Comp: v1_2_0,
        inputs: [...getPorts('input',
            ['detectColorScheme', 'colorScheme', 'notificationsPosition', 'connectKuzzle', 'appLoaderSize', 'loaderColor'])],
        outputs: [...getPorts('output', ['userRole'])]
    },
    'v1.3.0': {
        Comp: v1_3_0,
        inputs: [...getPorts('input', ['appLoaderColor', 'projectDefaults'])],
    }
}

//===================================================================

export default getReactNode('App', compVersions, true)
import { getEnumType, getPort } from '@rk/port-fabrik'
import { CompVersions, reactNode } from '@rk/node-fabrik'

const compVersions: CompVersions = {
    'v1.4.0': {
        module: import('./v1.4.0/AppLazy'),
        inputs: [
            getPort('projectDefaults', 'Defaults', 'Project', 'array', 'input', { isObject: true }),
            getPort('colorScheme', 'Color scheme', 'Style', getEnumType(['light', 'dark', 'auto']), 'input', { required: 'connection' }),
            getPort('appLoaderColor', 'Color', 'Loader', 'color', 'input', { required: 'both' }, '#073BF5')
        ],
        outputs: [
            getPort('colorScheme', 'Color scheme', 'Style', getEnumType(['light', 'dark', 'auto']), 'output'),
            getPort('colorSchemeChanged', 'Color scheme changed', 'Signals', 'signal', 'output'),
        ],
        signals: [
            getPort('setColorScheme', 'Set color scheme', 'Signals', 'signal', 'input'),
            getPort('toggleColorScheme', 'Toggle color scheme', 'Signals', 'signal', 'input'),
        ]
    },
}

//===================================================================

export default reactNode('App', compVersions, { allowChildren: true })
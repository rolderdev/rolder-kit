import { getCustomEnumType, getPort } from '@rk/port'
import { CompVersions, reactNode } from '@rk/node'

//import app130 from '../../monorepo_old/packages/mantine/nodes/app/fabricVersions/v0.1.0/v1.3.0/App'
import app140 from '@rk/app-v1.4.0'

const compVersions: CompVersions = {
    /*     'v1.3.0': {
            module: app130,
            inputs: [
                getPort({
                    plug: 'input', name: 'projectDefaults', displayName: 'Defaults', group: 'Project', type: 'array',
                    customs: { isObject: true }
                }),
                getPort({
                    plug: 'input', name: 'appLoaderColor', displayName: 'Color', group: 'Loader', type: 'color',
                    default: '#073BF5', customs: { required: 'both' }
                })
            ],
        }, */
    'v1.4.0': {
        module: app140,
        inputs: [
            getPort({
                plug: 'input', name: 'colorScheme', displayName: 'Color scheme', group: 'Style',
                type: getCustomEnumType(['light', 'dark', 'auto']), default: 'light', customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'appLoaderColor', displayName: 'Color', group: 'Loader', type: 'color',
                default: '#073BF5', customs: { required: 'both' }
            }),
        ],
        outputs: [
            getPort({ plug: 'output', name: 'colorScheme', displayName: 'Color scheme', group: 'Style', type: 'string' }),
            getPort({
                plug: 'output', name: 'colorSchemeChanged', displayName: 'Color scheme changed', group: 'Signals', type: 'signal'
            }),
        ],
        signals: [
            getPort({ plug: 'input', name: 'setColorScheme', displayName: 'Set color scheme', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'input', name: 'toggleColorScheme', displayName: 'Toggle color scheme', group: 'Signals', type: 'signal' }),
        ]
    },
}

//===================================================================
// @ts-ignore
window.Noodl.defineModule({
    reactNodes: [reactNode('App', compVersions, { allowChildren: true })],
    settings: [
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Rolder', tooltip: "Examples: rasko, tex" },
        { name: 'projectVersion', type: 'string', displayName: 'Project version', group: 'Rolder' },
        { name: 'mantineTheme', type: 'array', displayName: 'Mantine theme', group: 'Rolder' },
        { name: 'projectDefaults', type: 'array', displayName: 'Project defaults', group: 'Rolder' }
    ]
})
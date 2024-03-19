const urlParams = new URLSearchParams(window.location.search)
const d = parseInt(urlParams.get('debug') || '0')
import rKitJson from '../../package.json'

globalThis.R = {
    //@ts-ignore
    states: { backend: 'notInitialized', debug: d, devMode: DEVMODE },
    env: { rolderKit: rKitJson.version },
    params: {},
    libs: {},
    utils: {},
}

import { consola } from "consola"
switch (d) {
    case 0: consola.level = 0; break
    case 1: consola.level = 2; break
    case 2: consola.level = 3; break
}

globalThis.log = {
    start: () => performance.now(),
    end: (title, startTime) => consola.log(title, Math.round(performance.now() - startTime)),
    info: (title, ...args) => consola.info(title, ...args),
    error: (title, ...args) => consola.error(title, ...args)
}

document.body.insertAdjacentHTML("afterbegin", `<div style="position: absolute; top: 50%; left: 50%; margin-top: -28px; margin-left: -64px;">
    <h2>LOADING</h2>
</div>`)

// =====================================================
import libs from './src/libs'; R.libs = libs
import utils from './src/utils'; R.utils = utils
import * as icons from './src/icons'; R.libs.icons = icons

// =====================================================
import { getCustomEnumType, getPort } from '@shared/port'
import { reactNode } from '@shared/node'

import v140 from '@shared/app-v1.4.0'

Noodl.defineModule({
    reactNodes: [reactNode('App', {
        'v1.4.0': {
            module: {
                static: v140
            },
            inputs: [
                getPort({
                    plug: 'input', name: 'colorScheme', displayName: 'Color scheme', group: 'Style',
                    type: getCustomEnumType(['light', 'dark', 'auto']), default: 'light', customs: { required: 'connection' }
                }),
                getPort({
                    plug: 'input', name: 'setColorScheme', displayName: 'Set color scheme', group: 'Signals', type: 'signal',
                    customs: { dependsOn(props) { return props.colorScheme === 'auto' ? false : true } }
                }),
                getPort({
                    plug: 'input', name: 'toggleColorScheme', displayName: 'Toggle color scheme', group: 'Signals', type: 'signal',
                    customs: { dependsOn(props) { return props.colorScheme === 'auto' ? false : true } }
                }),
            ],
            outputs: [
                getPort({
                    plug: 'output', name: 'colorScheme', displayName: 'Color scheme', group: 'Style', type: 'string',
                    customs: { dependsOn(props) { return props.colorScheme === 'auto' ? false : true } }
                }),
                getPort({
                    plug: 'output', name: 'colorSchemeChanged', displayName: 'Color scheme changed', group: 'Signals', type: 'signal',
                    customs: { dependsOn(props) { return props.colorScheme === 'auto' ? false : true } }
                }),
            ]
        },
    }, { allowChildren: true, moduleName: 'app' })],
    settings: [
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Rolder', tooltip: "Examples: rasko, tex" },
        { name: 'projectVersion', type: 'string', displayName: 'Project version', group: 'Rolder' },
        { name: 'projectDefaults', type: 'array', displayName: 'Project defaults', group: 'Rolder' },
        { name: 'mantineTheme', type: 'array', displayName: 'Mantine theme', group: 'Rolder' },        
    ]
})
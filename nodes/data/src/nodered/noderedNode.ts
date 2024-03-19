import { jsNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

export default jsNode('nodered', {
    'v1.0.0': {
        module: {
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/nodered-v1.0.0')
        },
        inputs: [
            getPort({ plug: 'input', name: 'execute', displayName: 'Execute', group: 'Signals', type: 'signal' }),
            getPort({
                plug: 'input', name: 'flowEndpoint', displayName: 'Flow endpoint', group: 'Params', type: 'string',
                customs: { required: 'both' }
            }),
            getPort({ plug: 'input', name: 'flowData', displayName: 'Flow data', group: 'Data', type: '*' }),
        ],
        outputs: [
            getPort({ plug: 'output', name: 'executing', displayName: 'Executing', group: 'States', type: 'boolean', default: false }),
            getPort({ plug: 'output', name: 'executed', displayName: 'Executed', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'output', name: 'result', displayName: 'Result', group: 'Data', type: '*' }),
        ],
    }
}, { moduleName: 'data', color: 'purple' })
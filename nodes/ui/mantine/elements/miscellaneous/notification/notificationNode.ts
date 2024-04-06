import { jsNode } from '@packages/node'
import { getPort, getPorts } from '@packages/port'

export default jsNode('notification', {
    'v1.0.0': {
        module: {
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/notification-v1.0.0')
        },
        inputs: [
            ...getPorts('input', ['color']),
            getPort({ plug: 'input', name: 'send', displayName: 'Send', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'input', name: 'title', displayName: 'Title', group: 'Params', type: 'string' }),
            getPort({
                plug: 'input', name: 'message', displayName: 'Message', group: 'Params', type: 'string',
                customs: { required: 'connection' }
            }),
            getPort({ plug: 'input', name: 'autoClose', displayName: 'Auto close', group: 'Params', type: 'boolean', default: true }),
            getPort({
                plug: 'input', name: 'autoCloseTimeout', displayName: 'Auto close timeout', group: 'Params', type: 'number', default: 2000,
                customs: { dependsOn(p) { return p.autoClose ? true : false } }
            })
        ]
    }
}, { color: 'purple' })
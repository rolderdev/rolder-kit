import { jsNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

export default jsNode('logout', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/logout-v1.0.0'),
            remote: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                `remote/data/logout-v1.0.0`),
        },
        inputs: [getPort({ plug: 'input', name: 'logout', displayName: 'Logout', group: 'Signals', type: 'signal' })],
    }
}, { moduleName: 'data', color: 'purple' })
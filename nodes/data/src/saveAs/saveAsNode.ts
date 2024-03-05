import { jsNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

export default jsNode('saveAs', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/save-as-v1.0.0'),
            remote: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                `remote/data/save-as-v1.0.0`),
        },
        inputs: [
            getPort({ plug: 'input', name: 'saveAs', displayName: 'Save as', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'input', name: 'blob', displayName: 'Blob', group: 'Data', type: '*', customs: { required: 'connection' } }),
            ...getPorts('input', ['fileName'])
        ],
    }
}, { moduleName: 'data', color: 'purple' })
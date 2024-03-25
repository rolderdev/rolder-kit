import { jsNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

export default jsNode('saveAs', {
    'v1.0.0': {
        module: {
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/save-as-v1.0.0')
        },
        inputs: [
            getPort({ plug: 'input', name: 'saveAs', displayName: 'Save as', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'input', name: 'blob', displayName: 'Blob', group: 'Data', type: '*', customs: { required: 'connection' } }),
            ...getPorts('input', ['fileName'])
        ],
    }
}, { color: 'purple' })
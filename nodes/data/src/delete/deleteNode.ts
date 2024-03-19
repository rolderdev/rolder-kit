import { jsNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

export default jsNode('delete', {
    'v0.3.0': {
        module: {
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/delete-v0.3.0')
        },
        inputs: [
            ...getPorts('input', ['delete']),
            getPort({
                plug: 'input', name: 'deleteScheme', displayName: 'Delete scheme', group: 'Data', type: 'array',
                customs: { required: 'connection' }
            })
        ],
        outputs: getPorts('output', ['deleted', 'deleting'])
    },
    'v1.0.0': {
        module: {
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/delete-v1.0.0')
        },
        inputs: getPorts('input', ['delete', 'scheme']),
        outputs: getPorts('output', ['deleted', 'deleting'])
    }
}, { moduleName: 'data' })
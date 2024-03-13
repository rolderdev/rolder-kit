import { jsNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

export default jsNode('update', {
    'v0.3.0': {
        module: {
            default: 'remote',
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/update-v0.3.0'),
            remote: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                `remote/data/update-v0.3.0`),
        },
        inputs: [
            ...getPorts('input', ['update', 'scheme']),
            getPort({
                plug: 'input', name: 'updateScheme', displayName: 'Update scheme', group: 'Data', type: 'array',
                customs: { required: 'connection' }
            })
        ],
        outputs: [
            ...getPorts('output', ['updated', 'updating']),
            getPort({ plug: 'output', name: 'updatedData', displayName: 'Updated data', group: 'Data', type: 'object' })
        ]
    },
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/update-v1.0.0'),
            remote: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                `remote/data/update-v1.0.0`),
        },
        inputs: getPorts('input', ['update', 'scheme']),
        outputs: getPorts('output', ['updated', 'updating', 'data'])
    }
}, { moduleName: 'data' })
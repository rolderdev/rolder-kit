import { jsNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

export default jsNode('create', {
    'v0.4.0': {
        module: {
            default: 'remote',
            dynamic: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/create-v0.4.0'),
            remote: import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                `remote/data/create-v0.4.0`),
        },
        inputs: [
            ...getPorts('input', ['create']),
            getPort({
                plug: 'input', name: 'createScheme', displayName: 'Create scheme', group: 'Data', type: 'array',
                customs: { required: 'connection' }
            })
        ],
        outputs: [
            ...getPorts('output',['created','creating']),
            getPort({plug: 'output', name: 'createdData', displayName: 'Created data', group: 'Data', type: 'object'})
        ]
    }
}, { moduleName: 'data' })
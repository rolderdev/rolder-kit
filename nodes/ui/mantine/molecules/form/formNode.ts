import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Form', {
    'v0.5.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/form-v0.5.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/molecules/form-v0.5.0')),
        },
        inputs: [
            getPort({
                plug: 'input', name: 'formScheme', displayName: 'Scheme', group: 'Params', type: 'array',
                customs: { isObject: true, required: 'connection' }
            }),
        ],
        outputs: [
            getPort({ plug: 'output', name: 'formHook', displayName: 'Form hook', group: 'Form', type: 'object' }),
            getPort({ plug: 'output', name: 'submited', displayName: 'Submited', group: 'Signals', type: 'signal' }),
        ]
    }
}, { moduleName: 'mantine', allowChildren: true })
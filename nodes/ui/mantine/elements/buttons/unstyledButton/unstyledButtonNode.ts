import { reactNode } from '@shared/node'
import { getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('UnstyledButton', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/unstyled-button-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/elements/buttons/unstyled-button-v1.0.0')),
        },
        outputs: getPorts('output', ['clicked'])
    }
}, { moduleName: 'mantine', allowChildren: true })
import { reactNode } from '@shared/node'
import { lazy } from 'react'

export default reactNode('HoverCardTarget', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/hover-card-target-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/molecules/hover-card-target-v1.0.0')),
        }
    }
}, { moduleName: 'mantine', allowChildren: true })
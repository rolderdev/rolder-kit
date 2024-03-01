import { reactNode } from '@shared/node'
import { lazy } from 'react'

export default reactNode('PopoverTarget', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/popover-target-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/molecules/popover-target-v1.0.0')),
        }
    }
}, { moduleName: 'mantine', allowChildren: true })
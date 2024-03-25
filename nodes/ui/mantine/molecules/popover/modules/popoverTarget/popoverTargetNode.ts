import { reactNode } from '@shared/node'
import { lazy } from 'react'

export default reactNode('PopoverTarget', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/popover-target-v1.0.0'))
        }
    }
}, {  allowChildren: true })
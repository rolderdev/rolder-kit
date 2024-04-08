import { reactNode } from '@packages/node'
import { lazy } from 'react'

export default reactNode('PopoverTarget', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/popover-target-v1.0.0'))
        }
    }
}, {  allowChildren: true })
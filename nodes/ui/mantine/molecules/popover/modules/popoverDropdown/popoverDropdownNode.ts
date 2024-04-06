import { reactNode } from '@packages/node'
import { lazy } from 'react'

export default reactNode('PopoverDropdown', {
    'v1.0.0': {
        module: {            
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/popover-dropdown-v1.0.0'))
        }
    }
}, {  allowChildren: true })
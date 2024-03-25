import { reactNode } from '@shared/node'
import { lazy } from 'react'

export default reactNode('PopoverDropdown', {
    'v1.0.0': {
        module: {            
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/popover-dropdown-v1.0.0'))
        }
    }
}, {  allowChildren: true })
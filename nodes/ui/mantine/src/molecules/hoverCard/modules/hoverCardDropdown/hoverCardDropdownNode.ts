import { reactNode } from '@packages/node'
import { lazy } from 'react'

export default reactNode('HoverCardDropdown', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/hover-card-dropdown-v1.0.0'))
        }
    }
}, {  allowChildren: true })
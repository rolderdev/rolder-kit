import { reactNode } from '@shared/node'
import { lazy } from 'react'

export default reactNode('HoverCardDropdown', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/hover-card-dropdown-v1.0.0'))
        }
    }
}, { moduleName: 'mantine', allowChildren: true })
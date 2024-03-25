import { reactNode } from '@shared/node'
import { getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Paper', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/paper-v1.0.0'))
        },
        inputs: [
            ...inputGroups.Margins, ...inputGroups.Paddings,
            ...getPorts('input', ['customProps', 'opacity', 'shadow', 'radius', 'withBorder'])
        ]
    }
}, {  allowChildren: true })
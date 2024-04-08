import { reactNode } from '@packages/node'
import { getPorts } from '@packages/port'
import { lazy } from 'react'

export default reactNode('Box', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/box-v1.0.0'))
        },
        inputs: getPorts('input', ['customProps', 'opacity'])
    }
}, {  allowChildren: true })
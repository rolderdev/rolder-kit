import { reactNode } from '@packages/node'
import { getPorts } from '@packages/port'
import { lazy } from 'react'

export default reactNode('Center', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/center-v1.0.0')),
        },
        inputs: getPorts('input', ['customProps', 'opacity', 'inline'])
    }
}, {  allowChildren: true })
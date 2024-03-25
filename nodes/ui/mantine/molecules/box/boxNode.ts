import { reactNode } from '@shared/node'
import { getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Box', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/box-v1.0.0'))
        },
        inputs: getPorts('input', ['customProps', 'opacity'])
    }
}, {  allowChildren: true })
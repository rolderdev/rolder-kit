import { reactNode } from '@shared/node'
import { getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Center', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/center-v1.0.0')),
        },
        inputs: getPorts('input', ['customProps', 'opacity', 'inline'])
    }
}, { moduleName: 'mantine', allowChildren: true })
import { reactNode } from '@packages/node'
import { getPorts } from '@packages/port'
import { lazy } from 'react'

export default reactNode('UnstyledButton', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/unstyled-button-v1.0.0'))
        },
        inputs: getPorts('input', ['customProps']),
        outputs: getPorts('output', ['clicked'])
    }
}, { allowChildren: true })
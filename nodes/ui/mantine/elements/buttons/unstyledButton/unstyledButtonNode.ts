import { reactNode } from '@shared/node'
import { getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('UnstyledButton', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/unstyled-button-v1.0.0'))
        },
        inputs: getPorts('input', ['customProps']),
        outputs: getPorts('output', ['clicked'])
    }
}, { moduleName: 'mantine', allowChildren: true })
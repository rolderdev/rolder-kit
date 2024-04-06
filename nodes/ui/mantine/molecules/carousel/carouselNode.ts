import { reactNode } from '@packages/node'
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@packages/port'
import { lazy } from 'react'

const positions = ['left', 'center', 'right', 'apart']

export default reactNode('Carousel', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/carousel-v1.0.0'))
        },
        inputs: [...getPorts('input', ['customProps'])]
    }
}, { allowChildren: true })
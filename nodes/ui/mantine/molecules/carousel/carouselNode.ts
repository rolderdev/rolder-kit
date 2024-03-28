import { reactNode } from '@shared/node'
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

const positions = ['left', 'center', 'right', 'apart']

export default reactNode('Carousel', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/carousel-v1.0.0'))
        },
        inputs: [...getPorts('input', ['customProps'])]
    }
}, { allowChildren: true })
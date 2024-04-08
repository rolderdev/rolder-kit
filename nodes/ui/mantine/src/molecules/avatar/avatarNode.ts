import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts } from '@packages/port'
import { lazy } from 'react'

export default reactNode('Avatar', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/avatar-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', ['customProps', 'size', 'radius', 'color']),
            getPort({
                plug: 'input', name: 'avatarVariant', displayName: 'Variant', group: 'Style', default: 'light',
                type: getCustomEnumType(['light', 'filled', 'outline', 'gradient'])
            }),
        ]
    }
}, { allowChildren: true })
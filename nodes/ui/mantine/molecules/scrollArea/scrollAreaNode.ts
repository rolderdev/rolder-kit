import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('ScrollArea', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/scroll-area-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', ['customProps', 'w', 'opacity']),
            getPort({
                plug: 'input', name: 'scrollAreaBottomOffset', displayName: 'Bottom offset', group: 'Layout', type: 'number', default: 0,
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'offsetScrollbars', displayName: 'Offset scrollbars', group: 'Layout', type: 'boolean', default: false
            }),
            getPort({
                plug: 'input', name: 'scrollToMultiplier', displayName: 'Scroll to multiplier', group: 'Params', type: 'number', default: 1,
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'scrollBehavior', displayName: 'Scroll behavior', group: 'Params', default: 'smooth',
                type: getCustomEnumType(['smooth', 'instant', 'auto']), customs: { required: 'both' }
            }),
            getPort({ plug: 'input', name: 'scroll', displayName: 'Scroll', group: 'Signals', type: 'signal' }),
        ]
    }
}, { allowChildren: true })
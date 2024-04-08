import { reactNode } from '@packages/node'
import { getPort } from '@packages/port'
import { lazy } from 'react'

export default reactNode('DataContext', {
    'v0.1.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/data-context-v0.1.0'))
        },
        outputs: [
            getPort({ plug: 'output', name: 'fetched', displayName: 'Fetched', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'output', name: 'fetching', displayName: 'Fetching', group: 'States', type: 'boolean', default: false }),
        ]
    },
    'v0.1.1': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/data-context-v0.1.1'))
        },
        outputs: [
            getPort({ plug: 'output', name: 'fetched', displayName: 'Fetched', group: 'Signals', type: 'signal' }),
            getPort({ plug: 'output', name: 'fetching', displayName: 'Fetching', group: 'States', type: 'boolean', default: false }),
        ]
    }
}, { allowChildren: true })
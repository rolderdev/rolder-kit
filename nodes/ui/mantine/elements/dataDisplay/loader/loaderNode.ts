import { reactNode } from '@shared/node'
import { getPorts, getPort, getCustomEnumType } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Loader', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/loader-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', ['customProps', 'color', 'size']),
            getPort({
                plug: 'input', name: 'loaderVariant', displayName: 'Variant', group: 'Style', default: 'oval',
                type: getCustomEnumType(['oval', 'bars', 'dots'])
            }),
        ]
    }
})
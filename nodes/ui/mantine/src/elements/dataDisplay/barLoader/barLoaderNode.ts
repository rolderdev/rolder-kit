import { reactNode } from '@packages/node'
import { getPorts, getPort, getCustomEnumType, getUnitType, defaultUnits } from '@packages/port'
import { lazy } from 'react'

export default reactNode('BarLoader', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/bar-loader-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', ['customProps', 'loading']),
            getPort({ plug: 'input', name: 'loaderColor', displayName: 'Color', group: 'Params', type: 'string' }),
            getPort({
                plug: 'input', name: 'barLoaderWidth', displayName: 'Width', group: 'Params', default: '100%',
                type: getUnitType(defaultUnits, '%')
            }),
            getPort({ plug: 'input', name: 'zIndex', displayName: 'ZIndex', group: 'Params', type: 'number', default: 2 }),
        ]
    }
})
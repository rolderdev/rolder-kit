import { reactNode } from '@shared/node'
import { getPorts, getPort, getUnitType, defaultUnits, getCustomEnumType } from '@shared/port'
import { lazy } from 'react'

const positions = ['bottom-end', 'bottom-start', 'top-end', 'top-start', 'bottom-center', 'top-center', 'middle-center',
    'middle-end', 'middle-center']

export default reactNode('Indicator', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/indicator-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', ['customProps', 'color', 'radius', 'withBorder', 'disabled', 'inline', 'label']),
            getPort({ plug: 'input', name: 'sizeUnits', displayName: 'Size', group: 'Dimensions', type: getUnitType(defaultUnits, 'rem') }),
            getPort({
                plug: 'input', name: 'indicatorPosition', displayName: 'Position', group: 'Layout', default: 'top-end',
                type: getCustomEnumType(positions)
            }),
            getPort({ plug: 'input', name: 'indicatorProcessing', displayName: 'Processing', group: 'States', type: 'boolean', default: false }),
        ]
    }
}, { allowChildren: true })
import { reactNode } from '@packages/node'
import { getPorts, getPort, getCustomEnumType, getUnitType, defaultUnits, getMantinePort, inputGroups } from '@packages/port'
import { lazy } from 'react'

export default reactNode('Icon', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/icon-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'iconType', 'iconName', 'iconSize',
                'iconStroke', 'iconColor', 'themeIconVariant', 'themeIconSize',
                'themeIconRadius', 'themeIconColor', 'themeIconGradient',
            ]),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope', type: getCustomEnumType(['table']),
                default: 'table', customs: {
                    required: 'connection',
                    dependsOn(props) { return props.useScope ? true : false }
                }
            }),
        ]
    }
})
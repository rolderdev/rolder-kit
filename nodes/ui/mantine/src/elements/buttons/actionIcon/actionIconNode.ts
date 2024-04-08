import { reactNode } from '@packages/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@packages/port'
import { lazy } from 'react'

export default reactNode('ActionIcon', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/action-icon-v1.0.0'))
        },
        inputs: [
            ...inputGroups.Margins, ...inputGroups.Icon,
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'disabled', 'size', 'radius', 'color', 'loading'
            ]),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['table']), default: 'table', customs: {
                    required: 'connection', dependsOn(p) { return p.useScope ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'actionIconVariant', displayName: 'Variant', group: 'Style',
                type: getCustomEnumType(['transparent', 'subtle', 'light', 'filled', 'outline', 'default']),
                default: 'subtle', customs: { required: 'connection' }
            }),
        ],
        outputs: getPorts('output', ['clicked'])
    }
})
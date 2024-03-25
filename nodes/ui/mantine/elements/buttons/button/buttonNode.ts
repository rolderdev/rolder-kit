import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Button', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/button-v1.0.0'))
        },
        inputs: [
            ...inputGroups.Margins, ...inputGroups.Icon,
            ...getPorts('input', ['customProps', 'propsFunction', 'useScope', 'label', 'disabled', 'size', 'radius', 'color', 'loading']),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['table']), default: 'table', customs: {
                    required: 'connection', dependsOn(p) { return p.useScope ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'buttonVariant', displayName: 'Variant', group: 'Style',
                type: getCustomEnumType(['default', 'filled', 'subtle', 'outline', 'light', 'gradient', 'white']),
                default: 'filled', customs: { required: 'connection' }
            }),
            getPort({ plug: 'input', name: 'buttonType', displayName: 'Button type', group: 'Params', type: getCustomEnumType(['submit']) }),
        ],
        outputs: getPorts('output', ['clicked'])
    }
})
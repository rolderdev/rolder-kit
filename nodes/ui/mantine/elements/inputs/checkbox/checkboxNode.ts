import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Checkbox', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/checkbox-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'label', 'disabled', 'w', 'color', 'inputError', 'reset',
                'formField', 'radius', 'size', 'description'
            ]),
            getPort({
                plug: 'input', name: 'labelPosition', displayName: 'Label position', group: 'Layout', default: 'right',
                type: getCustomEnumType(['right', 'left']), customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['form']), default: 'form', customs: {
                    required: 'connection', dependsOn(p) { return p.useScope ? true : false }
                }
            }),
        ],
        outputs: getPorts('output', ['changed', 'checked'])
    }
})
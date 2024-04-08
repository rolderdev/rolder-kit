import { reactNode } from '@packages/node'
import { enums, getCustomEnumType, getEnumType, getPort, getPorts, inputGroups } from '@packages/port'
import { lazy } from 'react'

export default reactNode('CheckboxGroup', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@packages/checkbox-group-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'disabled', 'w', 'formField', 'labelField', 'inputItems',
                'defaultItems', 'label', 'withAsterisk', 'grow', 'resetSelected'
            ]),
            getPort({
                plug: 'input', name: 'orientation', displayName: 'Orientation', group: 'Layout', default: 'horizontal',
                type: getEnumType(enums.orientations),
            }),
            getPort({
                plug: 'input', name: 'checkBoxFz', displayName: 'Font size', group: 'Checkbox', default: 'sm',
                type: getEnumType(enums.sizes),
            }),
            getPort({ plug: 'input', name: 'checkboxColor', displayName: 'Color', group: 'Checkbox', type: 'string' }),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['form']), default: 'form', customs: {
                    required: 'connection', dependsOn(p) { return p.useScope ? true : false }
                }
            }),
        ],
        outputs: getPorts('output', ['selected', 'selectedItems'])
    }
})
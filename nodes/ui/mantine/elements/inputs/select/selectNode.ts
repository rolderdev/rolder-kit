import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Select', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/select-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'label', 'placeholder', 'disabled', 'withAsterisk', 'w',
                'inputError', 'formField', 'labelField', 'radius', 'inputItems', 'searchable', 'clearable',
                'creatable', 'backgroundColor', 'defaultItem', 'maxDropdownHeight', 'dropdownPosition', 'size', 'resetSelected'
            ]),
            ...inputGroups.Icon,
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['form']), default: 'form', customs: {
                    required: 'connection', dependsOn(p) { return p.useScope ? true : false }
                }
            })
        ],
        outputs: getPorts('output', ['selected', 'newValueSubmited', 'selectedItem', 'newValue', 'reseted'])
    }
})
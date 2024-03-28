import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('DatePickerInput', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/date-picker-input-v1.0.0'))
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'label', 'placeholder', 'disabled', 'withAsterisk', 'w',
                'inputError', 'reset', 'radius', 'clearable', 'limitMinDate', 'minDateOffset', 'formField', 'dropdownType'
            ]),
            getPort({
                plug: 'input', name: 'valueFormat', displayName: 'Date format', group: 'Params', default: 'YYYY.MM.DD HH:mm',
                type: 'string', customs: { required: 'connection', projectDefaultKey: 'dateFormat' }
            }),
            getPort({ plug: 'input', name: 'dateValue', displayName: 'Date value', group: 'Data', type: '*' }),
            getPort({
                plug: 'input', name: 'datePickerType', displayName: 'Type', group: 'Params', default: 'default',
                type: getCustomEnumType(['default', 'range', 'multiple']), customs: { required: 'connection' }
            }),
            ...inputGroups.Icon,
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['form']), default: 'form', customs: {
                    required: 'connection',
                    dependsOn(p) { return p.useScope ? true : false }
                }
            }),
        ],
        outputs: [
            ...getPorts('output', ['changed', 'reseted']),
            getPort({ plug: 'output', name: 'dateValue', displayName: 'Date value', group: 'Data', type: '*' }),
        ]
    },
    'v1.0.1': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/date-picker-input-v1.0.1'))
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'label', 'placeholder', 'disabled', 'withAsterisk', 'w',
                'inputError', 'reset', 'radius', 'clearable', 'limitMinDate', 'minDateOffset', 'formField', 'dropdownType'
            ]),
            getPort({
                plug: 'input', name: 'valueFormat', displayName: 'Date format', group: 'Params', default: 'YYYY.MM.DD HH:mm',
                type: 'string', customs: { required: 'connection', projectDefaultKey: 'dateFormat' }
            }),
            getPort({ plug: 'input', name: 'dateValue', displayName: 'Date value', group: 'Data', type: '*' }),
            getPort({
                plug: 'input', name: 'datePickerType', displayName: 'Type', group: 'Params', default: 'default',
                type: getCustomEnumType(['default', 'range', 'multiple']), customs: { required: 'connection' }
            }),
            ...inputGroups.Icon,
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['form']), default: 'form', customs: {
                    required: 'connection',
                    dependsOn(p) { return p.useScope ? true : false }
                }
            }),
        ],
        outputs: [
            ...getPorts('output', ['changed', 'reseted']),
            getPort({ plug: 'output', name: 'dateValue', displayName: 'Date value', group: 'Data', type: '*' }),
        ]
    }
})
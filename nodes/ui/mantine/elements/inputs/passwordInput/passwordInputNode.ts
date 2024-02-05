import { reactNode } from '@shared/node'
import { getCustomEnumType, getMantinePort, getPort, getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('PasswordInput', {
    'v0.4.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/password-input-v0.1.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/elements/inputs/password-input-v0.1.0')),
        },        
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'formField', 'label', 'placeholder', 'disabled', 'withAsterisk', 'w',
                'error', 'reset'
            ]),
            getMantinePort('radius', { comp: 'PasswordInput', prop: 'radius' }),
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['form']), default: 'form', customs: {
                    required: 'connection',
                    dependsOn(p) { return p.useScope ? true : false }
                }
            }),
        ],
        outputs: getPorts('output', ['typedValue', 'reseted'])
    }
}, { moduleName: 'mantine' })

/*
inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputError',
                'debouncedTyping', 'typingDelay', 'validationType', 'debouncedValidation', 'validationDelay'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['typedValue', 'reseted']),
        signals: getPorts('input', ['reset'])
*/
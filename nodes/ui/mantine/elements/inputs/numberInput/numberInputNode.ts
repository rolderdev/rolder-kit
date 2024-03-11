import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('NumberInput', {
    'v1.0.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/number-input-v1.0.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/mantine/elements/inputs/number-input-v1.0.0')),
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'label', 'placeholder', 'description', 'disabled', 'radius', 'withAsterisk', 'w',
                'inputError', 'hideControls', 'size', 'min', 'max', 'step', 'reset', 'increment', 'decrement'
            ]),
            ...inputGroups.Form, ...inputGroups.Icon,
            getPort({
                plug: 'input', name: 'scope', displayName: 'Scope', group: 'Scope',
                type: getCustomEnumType(['form']), default: 'form', customs: {
                    required: 'connection',
                    dependsOn(p) { return p.useScope ? true : false }
                }
            }),
            getPort({
                plug: 'input', name: 'numberInputVariant', displayName: 'Variant', group: 'Style',
                type: getCustomEnumType(['default', 'filled', 'unstyled']), default: 'default', customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'defaultNumberValue', displayName: 'Default value', group: 'Data', type: 'number',
                customs: { dependsOn(p) { return p.useScope ? false : true }, }
            }),
        ],
        outputs: [
            ...getPorts('output', ['changed', 'reseted']),
            getPort({ plug: 'output', name: 'value', displayName: 'Value', group: 'Data', type: 'number' })
        ]
    }
}, { moduleName: 'mantine' })
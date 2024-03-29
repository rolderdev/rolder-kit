import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort, getPorts, inputGroups } from '@shared/port'
import { lazy } from 'react'

export default reactNode('Textarea', {
    'v1.0.0': {
        module: {
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/textarea-v1.0.0')),
        },
        inputs: [
            ...getPorts('input', [
                'customProps', 'propsFunction', 'useScope', 'label', 'placeholder', 'disabled', 'withAsterisk', 'w',
                'inputError', 'reset', 'focusRightSection', 'debouncedTyping', 'typingDelay', 'radius', 'size', 'autosize'
            ]),
            getPort({
                plug: 'input', name: 'inputValue', displayName: 'Value', group: 'Data', type: 'string',
                customs: { dependsOn(p) { return p.useScope ? false : true }, }
            }),
            getPort({
                plug: 'input', name: 'variant', displayName: 'Variant', group: 'Style', default: 'default',
                type: getCustomEnumType(['default', 'filled', 'unstyled']), customs: { required: 'connection' }
            }),
            ...inputGroups.Form, ...inputGroups.Icon,
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
})
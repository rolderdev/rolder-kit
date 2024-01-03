import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_5_0 from './v0.5.0/TextInput'
import v0_6_0 from './v0.6.0/TextInput'

//===================================================================

const compVersions: CompVersions = {
    'v0.5.0': {
        hashTag: 'deprecated',
        Comp: v0_5_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputError',
                'debouncedTyping', 'typingDelay', 'validationType', 'debouncedValidation', 'validationDelay'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['typedValue', 'reseted']),
    },
    'v0.6.0': {
        Comp: v0_6_0,
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
    }
}

//===================================================================

export default getReactNode('TextInput', compVersions)
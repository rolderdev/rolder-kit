import { CompVersions, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/Textarea'
import v0_3_0 from './v0.3.0/Textarea'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts(
            'input', ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputError',
            'debouncedTyping', 'typingDelay', 'validationType', 'debouncedValidation', 'validationDelay', 'size', 'textareaVariant',
            'autosize', 'minRows', 'maxRows'],
            ['formField']
        ),
        outputs: getPorts('output', ['typedValue']),
    },
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: getPorts(
            'input', ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputError',
            'debouncedTyping', 'typingDelay', 'validationType', 'debouncedValidation', 'validationDelay', 'size', 'textareaVariant',
            'autosize', 'minRows', 'maxRows'],
            ['formField']
        ),
        outputs: getPorts('output', ['typedValue', 'reseted']),
        signals: getPorts('input', ['reset'])
    }
}

//===================================================================

export default getReactNode('Textarea', compVersions)
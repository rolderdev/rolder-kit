import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

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
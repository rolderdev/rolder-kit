import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_3_0 from './v0.3.0/MaskedInput'
import v0_3_1 from './v0.3.1/MaskedInput'

//===================================================================

const compVersions: CompVersions = {
    'v0.3.0': {
        Comp: v0_3_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputError',
                'debouncedTyping', 'typingDelay', 'validationType', 'debouncedValidation', 'validationDelay', 'maskType', 'maskPattern',
                'hideMaskPattern', 'overwriteMaskPattern', 'thousandsSeparator', 'radix', 'numberScale'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['typedValue', 'reseted'])
    },
    'v0.3.1': {
        Comp: v0_3_1,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputError',
                'debouncedTyping', 'typingDelay', 'validationType', 'debouncedValidation', 'validationDelay', 'maskType', 'maskPattern',
                'hideMaskPattern', 'overwriteMaskPattern', 'thousandsSeparator', 'radix', 'numberScale'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['typedValue', 'reseted'])
    }
}

//===================================================================

export default getReactNode('MaskedInput', compVersions)
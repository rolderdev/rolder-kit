import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_1_0 from './v0.1.0/NumberInput'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'placeholder', 'description', 'disabled', 'radius', 'withAsterisk', 'w',
                'inputError', 'hideControls', 'size', 'numberInputVariant', 'defaultNumberValue', 'min', 'max', 'step'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['value']),
        signals: getPorts('input', ['reset', 'increment', 'decrement'])
    }
}

//===================================================================

export default getReactNode('NumberInput', compVersions)
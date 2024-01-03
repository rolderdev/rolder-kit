import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'

import v0_2_0 from './v0.2.0/CheckboxGroup'
import v0_2_1 from './v0.2.1/CheckboxGroup'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        hashTag: 'deprecated',
        Comp: v0_2_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'withAsterisk', 'labelField', 'checkboxGroupOrientation', 'grow', 'disabled', 'w',
                'inputItems', 'checkBoxFz', 'checkboxColor', 'defaultItems'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'selectedItems']),
        signals: getPorts('input', ['resetSelected'])
    },
    'v0.2.1': {
        Comp: v0_2_1,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'withAsterisk', 'labelField', 'checkboxGroupOrientation', 'grow', 'disabled', 'w',
                'inputItems', 'checkBoxFz', 'checkboxColor', 'defaultItems'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'selectedItems']),
        signals: getPorts('input', ['resetSelected'])
    }
}

//===================================================================

export default getReactNode('CheckboxGroup', compVersions)
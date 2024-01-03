import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_5_0 from './v0.5.0/Select'
import v0_5_1 from './v0.5.1/Select'
import v0_6_0 from './v0.6.0/Select'

//===================================================================

const compVersions: CompVersions = {
    'v0.5.0': {
        Comp: v0_5_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'labelField', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w',
                'inputItems', 'searchable', 'clearable', 'creatable', 'backgroundColor', 'defaultItem', 'maxDropdownHeight',
                'dropdownPosition', 'inputError', 'size'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'createValueSubmited', 'selectedItem', 'createValue', 'reseted']),
        signals: getPorts('input', ['resetSelected'])
    },
    'v0.5.1': {
        Comp: v0_5_1,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'labelField', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w',
                'inputItems', 'searchable', 'clearable', 'creatable', 'backgroundColor', 'defaultItem', 'maxDropdownHeight',
                'dropdownPosition', 'inputError', 'size'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'createValueSubmited', 'selectedItem', 'createValue', 'reseted']),
        signals: getPorts('input', ['resetSelected'])
    }
    ,
    'v0.6.0': {
        Comp: v0_6_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'labelField', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w',
                'inputItems', 'searchable', 'clearable', 'creatable', 'backgroundColor', 'defaultItem', 'maxDropdownHeight',
                'dropdownPosition', 'inputError', 'size'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'createValueSubmited', 'selectedItem', 'createValue', 'reseted']),
        signals: getPorts('input', ['resetSelected'])
    }
}

//===================================================================

export default getReactNode('Select', compVersions)
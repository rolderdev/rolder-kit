import { CompVersions, getGroupedPorts, getPorts, getReactNode } from '@rk/node-fabrik'
import v0_2_0 from './v0.2.0/DateTimePicker'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'clearable',
                'dateFormatAtDateTimePicker', 'limitMinDate', 'minDateOffset', 'defaultDate'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'selectedDate']),
        signals: getPorts('input', ['resetSelected'])
    }
}

//===================================================================

export default getReactNode('DateTimePicker', compVersions)
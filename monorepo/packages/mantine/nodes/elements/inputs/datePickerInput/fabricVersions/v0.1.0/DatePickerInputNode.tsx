import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.6.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/DatePickerInput'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'clearable',
                'dateFormatAtDatePicker', 'limitMinDate', 'minDateOffset', 'defaultDate', 'dropdownType', 'datePickerType'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'selectedDates']),
        signals: getPorts('input', ['resetSelected'])
    }
}

//===================================================================

export default getReactNode('DatePickerInput', compVersions)
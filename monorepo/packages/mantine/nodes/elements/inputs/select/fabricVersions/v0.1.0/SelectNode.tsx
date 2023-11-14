import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_5_0 from './v0.5.0/Select'

//===================================================================

const compVersions: CompVersions = {
    'v0.5.0': {
        Comp: v0_5_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'labelField', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputItems',
                'searchable', 'clearable', 'creatable', 'backgroundColor', 'defaultItem', 'maxDropdownHeight', 'dropdownPosition', 'inputError'],
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
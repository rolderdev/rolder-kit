import { getReactNode } from '../../../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getGroupedPorts, getPorts } from '../../../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_2_0 from './v0.2.0/MultiSelect'

//===================================================================

const compVersions: CompVersions = {
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: [
            ...getPorts(
                'input', ['useForm', 'formField', 'label', 'labelField', 'placeholder', 'disabled', 'radius', 'withAsterisk', 'w', 'inputItems',
                'searchable', 'clearable', 'creatable', 'defaultItems', 'maxDropdownHeight', 'dropdownPosition'],
                ['formField']
            ),
            ...getGroupedPorts('input', ['Icon']),
        ],
        outputs: getPorts('output', ['selected', 'createValueSubmited', 'selectedItems', 'createValue']),
        signals: getPorts('input', ['resetSelected'])
    }
}

//===================================================================

export default getReactNode('MultiSelect', compVersions)
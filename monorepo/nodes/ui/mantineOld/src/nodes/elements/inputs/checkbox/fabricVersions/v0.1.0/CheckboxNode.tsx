import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/Checkbox'
import v0_2_0 from './v0.2.0/Checkbox'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        hashTag: 'deprecated',
        Comp: v0_1_0,
        inputs: getPorts(
            'input', ['useForm', 'formField', 'label', 'labelPosition', 'description', 'inputError', 'radius', 'size',
            'disabled', 'w', 'color'],
            ['formField']
        ),
        outputs: getPorts('output', ['selected']),
        signals: getPorts('input', ['reset'])
    },
    'v0.2.0': {
        Comp: v0_2_0,
        inputs: getPorts(
            'input', ['useForm', 'formField', 'label', 'labelPosition', 'description', 'inputError', 'radius', 'size',
            'disabled', 'w', 'color'],
            ['formField']
        ),
        outputs: getPorts('output', ['changed', 'checked']),
        signals: getPorts('input', ['reset'])
    }
}

//===================================================================

export default getReactNode('Checkbox', compVersions)
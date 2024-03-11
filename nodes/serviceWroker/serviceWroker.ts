// =====================================================
import { reactNode } from '@shared/node'

import v100 from '@shared/service-wroker-v1.0.0'

Noodl.defineModule({
    reactNodes: [reactNode('ServiceWroker', {
        'v1.0.0': {
            module: {
                default: 'static',
                static: v100
            },
        },
    }, { allowChildren: true, moduleName: 'serviceWroker' })]
})
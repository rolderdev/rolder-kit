import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'

import v100 from '@shared/pdf-view-v1.0.0'

export default reactNode('PdfView', {
    'v1.0.0': {
        module: {
            default: 'static',
            static: v100
        },
        inputs: [
            getPort({
                plug: 'input', name: 'wrap', displayName: 'Wrap', group: 'Params', type: 'boolean', default: true,
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'fixed', displayName: 'Fixed', group: 'Params', type: 'boolean', default: false,
                customs: { required: 'connection' }
            }),
        ]
    }
}, { moduleName: 'pdf', allowChildren: true })
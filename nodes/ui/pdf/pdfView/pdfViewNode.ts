import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'

import v010 from '@shared/pdf-view-v0.1.0'

export default reactNode('PdfView', {
    'v0.1.0': {
        module: {
            default: 'static',
            static: v010
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
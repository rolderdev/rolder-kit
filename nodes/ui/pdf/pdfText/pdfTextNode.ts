import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'

import v010 from '@shared/pdf-text-v0.1.0'

export default reactNode('PdfText', {
    'v0.1.0': {
        module: {
            default: 'static',
            static: v010
        },
        inputs: [
            getPort({
                plug: 'input', name: 'text', displayName: 'Text', group: 'Data', type: 'string',               
            }),
            getPort({
                plug: 'input', name: 'wrap', displayName: 'Wrap', group: 'Params', type: 'boolean', default: true,
                customs: { required: 'connection' }
            }),
        ]
    }
}, { moduleName: 'pdf' })
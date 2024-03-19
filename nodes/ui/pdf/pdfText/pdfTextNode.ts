import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'

import v100 from '@shared/pdf-text-v1.0.0'

export default reactNode('PdfText', {
    'v1.0.0': {
        module: { static: v100 },
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
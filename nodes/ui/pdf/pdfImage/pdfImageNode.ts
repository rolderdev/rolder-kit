import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'

import v010 from '@shared/pdf-image-v0.1.0'

export default reactNode('PdfImage', {
    'v0.1.0': {
        module: {
            default: 'static',
            static: v010
        },
        inputs: [
            getPort({
                plug: 'input', name: 'src', displayName: 'Image source', group: 'Data', type: 'string',
                customs: { required: 'connection' }
            }),
        ]
    }
}, { moduleName: 'pdf' })
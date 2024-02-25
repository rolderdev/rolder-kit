import { reactNode } from '@shared/node'
import { getPort } from '@shared/port'

import v100 from '@shared/pdf-image-v1.0.0'

export default reactNode('PdfImage', {
    'v1.0.0': {
        module: {
            default: 'static',
            static: v100
        },
        inputs: [
            getPort({
                plug: 'input', name: 'src', displayName: 'Image source', group: 'Data', type: 'string',
                customs: { required: 'connection' }
            }),
        ]
    }
}, { moduleName: 'pdf' })
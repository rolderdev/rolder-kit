import { reactNode } from '@shared/node'
import { getPorts } from '@shared/port'

import v100 from '@shared/pdf-document-v1.0.0'

export default reactNode('PdfDocument', {
    'v1.0.0': {
        module: {
            default: 'static',            
            static: v100
        },
        inputs: getPorts('input', ['create']),
        outputs: getPorts('output', ['creating', 'created', 'blob'])
    }
}, { moduleName: 'pdf', allowChildren: true })
import { reactNode } from '@shared/node'
import { getPorts } from '@shared/port'

import v010 from '@shared/pdf-document-v0.1.0'

export default reactNode('PdfDocument', {
    'v0.1.0': {
        module: {
            default: 'static',            
            static: v010
        },
        inputs: getPorts('input', ['create']),
        outputs: getPorts('output', ['creating', 'created', 'blob'])
    }
}, { moduleName: 'pdf', allowChildren: true })
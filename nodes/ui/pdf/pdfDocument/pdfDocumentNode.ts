import { reactNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'

import v100 from '@shared/pdf-document-v1.0.0'
import v110 from '@shared/pdf-document-v1.1.0'

export default reactNode('PdfDocument', {
    'v1.0.0': {
        module: { static: v100 },
        inputs: getPorts('input', ['create']),
        outputs: getPorts('output', ['creating', 'created', 'blob'])
    },
    'v1.1.0': {
        module: { static: v110 },
        inputs: [
            ...getPorts('input', ['create']),
            getPort({ plug: 'input', name: 'fonts', displayName: 'Fonts', group: 'Style', type: 'array' }),
        ],
        outputs: getPorts('output', ['creating', 'created', 'blob'])
    }
}, { allowChildren: true })
import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort } from '@shared/port'

import v100 from '@shared/pdf-page-v1.0.0'

export default reactNode('PdfPage', {
    'v1.0.0': {
        module: {
            default: 'static',
            static: v100
        },
        inputs: [
            getPort({
                plug: 'input', name: 'orientation', displayName: 'Orientation', group: 'Params',
                type: getCustomEnumType(['portrait', 'landscape']), default: 'portrait', customs: { required: 'connection' }
            }),
        ]
    }
}, { moduleName: 'pdf', allowChildren: true })
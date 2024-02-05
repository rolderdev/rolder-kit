import { reactNode } from '@shared/node'
import { getCustomEnumType, getPort } from '@shared/port'

import v010 from '@shared/pdf-page-v0.1.0'

export default reactNode('PdfPage', {
    'v0.1.0': {
        module: {
            default: 'static',
            static: v010
        },
        inputs: [
            getPort({
                plug: 'input', name: 'orientation', displayName: 'Orientation', group: 'Params',
                type: getCustomEnumType(['portrait', 'landscape']), default: 'portrait', customs: { required: 'connection' }
            }),
        ]
    }
}, { moduleName: 'pdf', allowChildren: true })
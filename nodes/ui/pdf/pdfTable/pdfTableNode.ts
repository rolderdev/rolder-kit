import { reactNode } from '@shared/node'
import { getPort, getPorts, getType } from '@shared/port'

import v100 from '@shared/pdf-table-v1.0.0'
import v110 from '@shared/pdf-table-v1.1.0'

export default reactNode('PdfTable', {
    'v1.0.0': {
        module: {
            default: 'static',
            static: v100
        },
        inputs: [
            getPort({
                plug: 'input', name: 'columns', displayName: 'Columns', group: 'Params', type: 'array',
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'wrap', displayName: 'Wrap', group: 'Params', type: 'boolean', default: true,
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'wrapChildren', displayName: 'Wrap children', group: 'Params', type: 'boolean', default: false,
                customs: { required: 'connection' }
            }),            
            ...getPorts('input', ['items']),
            getPort({
                plug: 'input', name: 'childrenAccessor', displayName: 'Children accessor', group: 'Params', type: 'string',
            }),
            getPort({
                plug: 'input', name: 'noHeader', displayName: 'No header', group: 'Params', type: 'boolean', default: false,
            }),
            getPort({
                plug: 'input', name: 'isChild', displayName: 'Is child', group: 'Params', type: getType('boolean', 'connection'),
                default: false
            }),
        ],
    },
    'v1.1.0': {
        module: {
            default: 'static',
            static: v110
        },
        inputs: [
            getPort({
                plug: 'input', name: 'columns', displayName: 'Columns', group: 'Params', type: 'array',
                customs: { required: 'editor' }
            }),
            getPort({
                plug: 'input', name: 'wrap', displayName: 'Wrap', group: 'Params', type: 'boolean', default: true,
                customs: { required: 'connection' }
            }),
            getPort({
                plug: 'input', name: 'wrapChildren', displayName: 'Wrap children', group: 'Params', type: 'boolean', default: false,
                customs: { required: 'connection' }
            }),            
            ...getPorts('input', ['customProps', 'propsFunction', 'items']),
            getPort({
                plug: 'input', name: 'childrenAccessor', displayName: 'Children accessor', group: 'Params', type: 'string',
            }),
            getPort({
                plug: 'input', name: 'noHeader', displayName: 'No header', group: 'Params', type: 'boolean', default: false,
            }),
            getPort({
                plug: 'input', name: 'isChild', displayName: 'Is child', group: 'Params', type: getType('boolean', 'connection'),
                default: false
            }),
        ],
    }
}, { moduleName: 'pdf', allowChildren: true })
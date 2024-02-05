import { reactNode } from '@shared/node'
import { getPort, getPorts } from '@shared/port'
import { lazy } from 'react'

export default reactNode('PdfViewer', {
    'v0.1.0': {
        module: {
            default: 'remote',
            dynamic: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                '@shared/pdf-viewer-v0.1.0')),
            //@ts-ignore
            remote: lazy(() => import(
                /* webpackPrefetch: true */
                /* webpackPreload: true */
                //@ts-ignore
                'remote/ui/pdf/pdf-viewer-v0.1.0')),
        },
        inputs: [
            ...getPorts('input', ['nextPage', 'previousPage']),
            getPort({ plug: 'input', name: 'sourceUrl', displayName: 'Source', group: 'Data', type: '*' }),
            getPort({
                plug: 'input', name: 'currentPage', displayName: 'Current page', group: 'Params', type: 'number', default: 1,
                customs: { required: 'connection' }

            }),
            getPort({ plug: 'input', name: 'pdfViewerWidth', displayName: 'Width', group: 'Dimensions', type: 'number' }),
            getPort({ plug: 'input', name: 'pdfViewerHeight', displayName: 'Height', group: 'Dimensions', type: 'number' }),
        ],
        outputs: [
            getPort({ plug: 'output', name: 'currentPage', displayName: 'Current page', group: 'Params', type: 'number' }),
            getPort({ plug: 'output', name: 'totalPages', displayName: 'Total pages', group: 'Params', type: 'number' }),
        ]
    }
}, { moduleName: 'pdf' })
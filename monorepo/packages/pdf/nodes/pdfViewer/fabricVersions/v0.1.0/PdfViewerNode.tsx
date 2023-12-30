import { getReactNode } from '../../../../../../libs/nodesFabric/v0.1.0/getNode/v0.7.0/getNode'
import { getPorts } from '../../../../../../libs/nodesFabric/v0.1.0/portsFabric/v0.5.0/get'

import v0_1_0 from './v0.1.0/PdfViewerLazy'

//===================================================================

const compVersions: CompVersions = {
    'v0.1.0': {
        Comp: v0_1_0,
        inputs: getPorts('input', ['sourceUrl', 'currentPage', 'pdfViewerWidth', 'pdfViewerHeight'], ['sourceUrl']),
        outputs: getPorts('output', ['currentPage', 'totalPages']),
        signals: getPorts('input', ['nextPage', 'previousPage'])
    }
}

//===================================================================

export default getReactNode('PdfViewer', compVersions)
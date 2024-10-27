import pdfDocumentNode from '@nodes/pdf-document'
import pdfImageNode from '@nodes/pdf-image'
import pdfPageNode from '@nodes/pdf-page'
import pdfTableNode from '@nodes/pdf-table'
import pdfTextNode from '@nodes/pdf-text'
import pdfViewNode from '@nodes/pdf-view'
import pdfViewerNode from '@nodes/pdf-viewer'

Noodl.defineModule({
	reactNodes: [pdfDocumentNode, pdfPageNode, pdfViewNode, pdfTextNode, pdfImageNode, pdfViewerNode, pdfTableNode],
})

import pdfDocumentNode from '@nodes/pdf-document';
import pdfPageNode from '@nodes/pdf-page';
import pdfViewNode from '@nodes/pdf-view';
import pdfTextNode from '@nodes/pdf-text';
import pdfImageNode from '@nodes/pdf-image';
import pdfViewerNode from '@nodes/pdf-viewer';
import pdfTableNode from '@nodes/pdf-table';

Noodl.defineModule({
	reactNodes: [pdfDocumentNode, pdfPageNode, pdfViewNode, pdfTextNode, pdfImageNode, pdfViewerNode, pdfTableNode]
});

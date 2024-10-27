import ReactPDF = require('@react-pdf/renderer')
import type { BaseReactProps } from '@packages/node'

export type Props = BaseReactProps & {
	sourceUrl?: string
	currentPage?: number
	totalPages?: number
	pdfViewerWidth?: number
	pdfViewerHeight?: number
}

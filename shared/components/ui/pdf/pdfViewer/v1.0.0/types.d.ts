import ReactPDF = require('@react-pdf/renderer')
import { BaseReactProps } from '@shared/node'

export type Props = BaseReactProps & {
    sourceUrl?: string
    currentPage?: number    
    totalPages?: number
    pdfViewerWidth?: number
    pdfViewerHeight?: number
}
import ReactPDF from "@react-pdf/renderer"
import { BaseProps } from "../../../../../../mantine/nodes/types"

export type CompProps = BaseProps & {
    sourceUrl?: string
    currentPage?: number    
    totalPages?: number
    pdfViewerWidth?: number
    pdfViewerHeight?: number
}
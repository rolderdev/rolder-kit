import ReactPDF from "@react-pdf/renderer"
import { BaseProps } from "../../../../../../mantine/nodes/types"

export type CompProps = BaseProps & {
    pdfTextStyles?: ReactPDF.Styles
    pdfTextContent?: string
}
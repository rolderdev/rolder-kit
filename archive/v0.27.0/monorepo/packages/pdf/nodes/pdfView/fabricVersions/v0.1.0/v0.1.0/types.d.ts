import ReactPDF from "@react-pdf/renderer"
import { BaseProps } from "../../../../../../mantine/nodes/types"

export type CompProps = BaseProps & {
    pdfViewStyles?: ReactPDF.Styles    
}
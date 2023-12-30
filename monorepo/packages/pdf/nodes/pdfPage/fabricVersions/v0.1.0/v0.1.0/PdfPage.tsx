import { Page, StyleSheet } from "@react-pdf/renderer";
import { forwardRef } from "react"
import { CompProps } from "./types";
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"

const childrenNames = ['PdfView', 'PdfText', 'PdfImage']

export default forwardRef(function (props: CompProps) {
    const p = { ...getCompProps(props) } as CompProps

    const styles = StyleSheet.create({ page: p.pdfPageStyles || {} })

    const ch = p.children as any

    const children = Array.isArray(ch)
        ? ch.filter(i => childrenNames.includes(i.props.noodlNode?.model.type.split('.')[1]))
        : childrenNames.includes(ch?.props.noodlNode?.model.type.split('.')[1]) ? ch : undefined

    return <Page style={styles.page} {...p.customProps}>{children}</Page>
})
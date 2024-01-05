import { StyleSheet, Text } from "@react-pdf/renderer";
import { forwardRef } from "react"
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"
import { CompProps } from "./types";

export default forwardRef(function (props: CompProps) {
    const p = { ...getCompProps(props) } as CompProps

    const styles = StyleSheet.create({ text: { fontFamily: "Roboto", ...p.pdfTextStyles } || {} })

    return <Text style={styles.text} {...p.customProps}>{p.pdfTextContent}</Text>
})
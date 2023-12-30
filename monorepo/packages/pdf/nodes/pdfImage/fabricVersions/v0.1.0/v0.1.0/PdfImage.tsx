import { Image, StyleSheet } from "@react-pdf/renderer";
import { forwardRef } from "react"
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"
import { CompProps } from "./types";

export default forwardRef(function (props: CompProps) {
    const p = { ...getCompProps(props) } as CompProps

    const styles = StyleSheet.create({ image: p.pdfImageStyles || {} })

    return <Image style={styles.image} src={p.pdfImageSource} {...p.customProps} />
})
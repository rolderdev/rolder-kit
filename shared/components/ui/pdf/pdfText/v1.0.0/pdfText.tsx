import { StyleSheet, Text } from "@react-pdf/renderer";
import { forwardRef } from "react"
import { Props } from "./types";
import React from "react";
import { getCompProps } from "@shared/get-comp-props"

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    const styles = StyleSheet.create({ text: { fontFamily: 'Roboto', ...p.style || {} } })

    return <Text
        wrap={p.wrap}
        style={styles.text}
        {...p.customProps}
    >{p.text}</Text>
})
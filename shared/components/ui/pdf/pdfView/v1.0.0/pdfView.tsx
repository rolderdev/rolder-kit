import { View } from "@react-pdf/renderer";
import { forwardRef } from "react"
import { Props } from "./types";
import React from "react";
import { getCompProps } from "@shared/get-comp-props"

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <View
        wrap={p.wrap}
        fixed={p.fixed}
        style={p.style}
        {...p.customProps}
    >{p.children}</View>
})
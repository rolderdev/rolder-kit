import { Image } from "@react-pdf/renderer";
import { forwardRef } from "react"
import { Props } from "./types";
import React from "react";
import { getCompProps } from "@shared/get-comp-props"

export default forwardRef(function (props: Props) {
    const p = { ...getCompProps(props) } as Props

    return <Image style={p.style} src={p.src} {...p.customProps} />
})
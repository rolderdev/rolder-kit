import BarLoader from "react-spinners/BarLoader"
import { forwardRef } from "react"
import type { Props } from "./types"
import React from "react"
import convertColor from "@packages/convert-color"

export default forwardRef(function (props: Props) {
    return <BarLoader
        color={convertColor(props.loaderColor)}
        loading={props.loading}
        cssOverride={{
            borderRadius: 4,
            width: props.barLoaderWidth,
            zIndex: props.zIndex
        }}
        {...props}
        {...props.customProps}
    />
})
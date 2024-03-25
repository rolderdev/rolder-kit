import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import { Loader } from "@mantine/core"

export default forwardRef(function (props: Props) {
    return <Loader
        variant={props.loaderVariant}
        {...props}
        {...props.customProps}
    />
})
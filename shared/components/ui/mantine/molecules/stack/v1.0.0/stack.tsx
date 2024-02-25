import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import { Stack } from "@mantine/core"

export default forwardRef(function (props: Props) {

    return <Stack
        align={props.stackAlign}
        justify={props.stackJustify}
        spacing={props.stackSpacing}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Stack>
})
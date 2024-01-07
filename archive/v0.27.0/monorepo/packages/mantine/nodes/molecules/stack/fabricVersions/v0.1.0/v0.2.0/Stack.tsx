import { Stack } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Stack
        align={props.stackAlign}
        justify={props.stackJustify}
        spacing={props.stackSpacing}
        {...props}
        {...props.customProps}>
        {props.children}
    </Stack>
})
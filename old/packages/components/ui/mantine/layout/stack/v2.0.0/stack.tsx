import { forwardRef } from "react"
import type { Props } from "./types"
import { Stack } from "@mantine/core"

export default forwardRef(function (props: Props) {

    return <Stack
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Stack>
})

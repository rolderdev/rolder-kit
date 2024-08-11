import { forwardRef } from "react"
import type { Props } from "./types";;
import { Box } from "@mantine/core";

export default forwardRef(function (props: Props) {

    return <Box
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Box>
})
